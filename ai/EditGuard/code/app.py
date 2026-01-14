import os
import io
import base64
import random
import numpy as np
from PIL import Image
from datetime import datetime
from flask import Flask, request, jsonify

import torch
import torch.nn.functional as F
from models import create_model as create_model_editguard
import options.options as option
from utils.JPEG import DiffJPEG

# ========== Flask 설정 ==========
app = Flask(__name__)
os.makedirs("static/outputs", exist_ok=True)

# ========== 유틸 ==========
def img_to_base64(img):
    if isinstance(img, str):
        with open(img, "rb") as f:
            return base64.b64encode(f.read()).decode()
    else:
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode()

def rand(num_bits=64):
    return ''.join([str(random.randint(0, 1)) for _ in range(num_bits)])

def calculate_similarity_percentage(str1, str2):
    if len(str1) == 0:
        return "원본 워터마크 없음"
    elif len(str1) != len(str2):
        return "길이 불일치"
    same = sum(1 for a, b in zip(str1, str2) if a == b)
    return f"{(same / len(str1)) * 100:.2f}%"

def timestamped_filename(prefix: str, suffix: str = ".png"):
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{prefix}_{now}{suffix}"

# ========== 모델 로드 ==========
def imgae_model_select(ckp_index=0):
    opt = option.parse("options/test_editguard.yml", is_train=True)
    opt['dist'] = False
    opt = option.dict_to_nonedict(opt)
    torch.backends.cudnn.benchmark = True
    model = create_model_editguard(opt)
    model_pth = '../checkpoints/clean.pth'
    model.load_test(model_pth)
    return model

model = imgae_model_select(0)

# ========== Core 함수 ==========
def load_image(image_np, message=None):
    img_GT = image_np / 255.0
    img_GT = img_GT[:, :, [2, 1, 0]]  # RGB → BGR
    img_GT = torch.from_numpy(np.transpose(img_GT, (2, 0, 1))).float().unsqueeze(0)
    img_GT = F.interpolate(img_GT, size=(512, 512), mode='nearest', align_corners=None)
    img_GT = img_GT.unsqueeze(0)  # [1, 1, C, H, W]

    _, T, C, W, H = img_GT.shape
    blue_img = np.full((H, W, 3), [255, 0, 0], dtype=np.uint8) / 255.0
    expanded = np.repeat(np.expand_dims(blue_img, axis=0), T, axis=0)
    imgs_LQ = torch.from_numpy(np.ascontiguousarray(expanded)).float().permute(0, 3, 1, 2)
    imgs_LQ = F.interpolate(imgs_LQ, size=(W, H), mode='nearest', align_corners=None)
    imgs_LQ = imgs_LQ.unsqueeze(0)

    return {
        'LQ': torch.stack([imgs_LQ], dim=0),
        'GT': img_GT,
        'MES': message
    }

def hiding(image_np, bit_input, model):
    message = np.array([int(b) for b in bit_input]) - 0.5
    data = load_image(image_np, message)
    model.feed_data(data)
    container = model.image_hiding()
    return container

def revealing(image_np, model_list_index, model):
    threshold = 0.2
    data = load_image(image_np)
    model.feed_data(data)
    mask_np, recovered = model.image_recovery(threshold)
    recovered_bits = ''.join([str(int(x)) for x in recovered.cpu().numpy()[0]])



    # acc = calculate_similarity_percentage(input_bit, recovered_bits)
    mask_img = Image.fromarray(mask_np.astype(np.uint8))
    return mask_img, recovered_bits

def decode_base64_image(base64_str):
    try:
        image_data = base64.b64decode(base64_str)
        return Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        raise ValueError("Invalid base64 image string") from e

def img_to_base64(obj):
    """path(str) | PIL.Image | bytes -> base64 str"""
    if isinstance(obj, str):  # 파일 경로
        with open(obj, "rb") as f:
            return base64.b64encode(f.read()).decode()
    if isinstance(obj, Image.Image):  # PIL 이미지
        buf = io.BytesIO()
        obj.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode()
    if isinstance(obj, (bytes, bytearray)):  # 원시 바이트
        return base64.b64encode(obj).decode()
    raise TypeError(f"Unsupported type for img_to_base64: {type(obj)}")

# ========== API: 워터마크 삽입 ==========
@app.route("/upload", methods=["POST"])
def upload():
    try:
        data = request.get_json()
        image_file = data.get("image")
        model_name = data.get("model")
        image = decode_base64_image(image_file)
        image_np = np.array(image)
        bit_input = data.get("bit_input")

        if model_name=="EditGuard":
            container_np = hiding(image_np, bit_input, model)
            container_img = Image.fromarray(container_np)

            gt_path = os.path.join("static/outputs", timestamped_filename("upload_gt"))
            srh_path = os.path.join("static/outputs", timestamped_filename("upload_sr_h"))

            image.save(gt_path)
            container_img.save(srh_path)

        return jsonify({
            "success": True,
            "data": {
                "lr": img_to_base64(container_img),
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ========== API: 위변조 검증 ==========
@app.route("/verify", methods=["POST"])
def verify():
    try:
        data = request.get_json()
        image_file = data.get("sr_h")
        model_name = data.get("model")
        image = decode_base64_image(image_file)
        image_np = np.array(image)

        # bit_input = data.get("bit_input")
        if model_name=="EditGuard":
            mask_img, recovered_bit = revealing(image_np, 0, model)

            mask_path = os.path.join("static/outputs", timestamped_filename("verify_mask"))
            mask_img.save(mask_path)
    
        return jsonify({
            "success": True,
            "data": {
                # "acc": acc,
                "mask": img_to_base64(mask_img),
                "recovered_bit": recovered_bit
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ========== API: 랜덤 워터마크 생성 ==========
@app.route("/randbit", methods=["GET"])
def randbit():
    return jsonify({"bit": rand()})

# ========== 서버 실행 ==========
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2002)
