import os
import io
import base64
import random
import numpy as np
from PIL import Image
from datetime import datetime
from flask import Flask, request, jsonify
from typing import Union
import traceback
import torch
import torch.nn.functional as F
from einops import rearrange
from EditGuard.code.models import create_model as create_model_editguard
import EditGuard.code.options.options as option
from EditGuard.code.utils.JPEG import DiffJPEG

from RobustWide.extract import *
from RobustWide.inference import *

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
    opt = option.parse("EditGuard/code/options/test_editguard.yml", is_train=True)
    opt['dist'] = False
    opt = option.dict_to_nonedict(opt)
    torch.backends.cudnn.benchmark = True
    model = create_model_editguard(opt)
    model_pth = 'EditGuard/checkpoints/clean.pth'
    model.load_test(model_pth)
    return model


def init_RW():
    wm_model, message_length = load_wm_model(ckpt_dir="RobustWide/checkpoints")
    wm_model = wm_model.to("cuda:0")
    return wm_model

EG_model = imgae_model_select(0)
RW_model = init_RW()

# ========== Core 함수 ==========
def resize_and_crop(image_np, target_size=512):
    """
    Numpy 배열 이미지를 받아 비율을 유지하며 리사이즈하고 중앙을 크롭합니다.
    """
    image = Image.fromarray(image_np)
    w, h = image.size
    if w < h:
        ow = target_size
        oh = int(target_size * h / w)
    else:
        oh = target_size
        ow = int(target_size * w / h)
        
    image = image.resize((ow, oh), Image.Resampling.LANCZOS)
    w, h = image.size
    left = (w - target_size) / 2
    top = (h - target_size) / 2
    right = (w + target_size) / 2
    bottom = (h + target_size) / 2
    
    image = image.crop((left, top, right, bottom))
    return np.array(image)

def load_image(image_np, message=None):
    image_np = resize_and_crop(image_np, target_size=512)
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

def load_image_RW(img_input: Union[str, Image.Image], target_size: int = 512) -> torch.Tensor:
    """
    base64(또는 data URL)로 인코딩된 이미지를 받아 전처리 후
    배치 차원이 포함된 텐서 (1, 3, H, W)를 반환합니다.
    - Normalize(mean=[0.5]*3, std=[0.5]*3) → 값 범위 [-1, 1]
    """
    # 1) 입력 → PIL.Image
    if isinstance(img_input, Image.Image):
        pil_img = img_input.convert("RGB")
    elif isinstance(img_input, str):
        s = img_input.strip()
        # data URL인 경우 헤더 제거
        if s.startswith("data:"):
            try:
                s = s.split(",", 1)[1]
            except Exception:
                raise ValueError("잘못된 data URL 형식입니다.")
        try:
            img_bytes = base64.b64decode(s, validate=False)
        except Exception as e:
            raise ValueError(f"base64 디코딩 실패: {e}")
        try:
            pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"이미지 열기 실패(PIL): {e}")
    else:
        raise TypeError("img_input은 base64 문자열 또는 PIL.Image여야 합니다.")

    # 2) 전처리 파이프라인
    tform = transforms.Compose([
        transforms.Resize(target_size, antialias=True),   # 짧은 변을 target_size로
        transforms.CenterCrop(target_size),
        transforms.ToTensor(),                            # (C,H,W), float32, [0,1]
        transforms.Normalize(mean=[0.5, 0.5, 0.5],
                             std=[0.5, 0.5, 0.5])         # [-1, 1]
    ])

    # 3) 배치 차원 추가해서 반환: (1, 3, H, W)
    return tform(pil_img).unsqueeze(0)

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

def save_image_for_tensor(image):
    image = torch.clamp((image + 1.0) / 2.0, min=0.0, max=1.0)
    grid = 255. * rearrange(image, 'c h w -> h w c').cpu().detach().numpy()
    #Image.fromarray(grid.astype(np.uint8)).save(save_path)
    return Image.fromarray(grid.astype(np.uint8))

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
            container_np = hiding(image_np, bit_input, EG_model)
            container_img = Image.fromarray(container_np)

            gt_path = os.path.join("static/outputs", timestamped_filename("upload_EG_gt"))
            lr_path = os.path.join("static/outputs", timestamped_filename("upload_EG_lr"))

            image.save(gt_path)
            container_img.save(lr_path)

        elif model_name=="RobustWide":
            bit_tensor = torch.tensor([int(c) for c in bit_input], dtype=torch.float).unsqueeze(0).to("cuda:0")
            image_input = load_image_RW(image_file).to("cuda:0")
            container_np = RW_model.encoder(image_input, bit_tensor).squeeze()
            container_img = save_image_for_tensor(container_np)

            gt_path = os.path.join("static/outputs", timestamped_filename("upload_RW_gt"))
            lr_path = os.path.join("static/outputs", timestamped_filename("upload_RW_lr"))

            image.save(gt_path)
            container_img.save(lr_path)

        return jsonify({
            "success": True,
            "data": {
                "lr": img_to_base64(container_img),
            }
        })
    except Exception as e:
        traceback.print_exc()
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

        if model_name=="EditGuard":
            mask_img, recovered_bit = revealing(image_np, 0, EG_model)

            mask_path = os.path.join("static/outputs", timestamped_filename("verify_mask"))
            mask_img.save(mask_path)
            mask = img_to_base64(mask_img)

        elif model_name=="RobustWide":
            image_input = load_image_RW(image_file).to("cuda:0")
            decoded_message = RW_model.decoder(image_input)[0]
            recovered_bit = ''.join(map(str, (decoded_message >= 0.5).int().cpu().tolist()))

            mask = "0000000000000000000000000000000000000000000000000000000000000000"

        return jsonify({
            "success": True,
            "data": {
                # "acc": acc,
                "mask": mask,
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
