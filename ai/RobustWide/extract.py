import os
import torch
from torchvision import transforms
import argparse
from PIL import Image
from omegaconf import OmegaConf
from .model import WatermarkModel

def load_wm_model(ckpt_dir, wm_model_config_path=None):
    if wm_model_config_path is None:
        wm_model_config_path = os.path.join(ckpt_dir, "wm_model_config.yaml")
    wm_model_config = OmegaConf.load(wm_model_config_path)
    message_length = wm_model_config["wm_enc_config"]["message_length"]
    model = WatermarkModel(**wm_model_config)
    model_ckpt = torch.load(os.path.join(ckpt_dir, "wm_model.ckpt"), map_location='cpu')
    model.load_state_dict(model_ckpt)
    model.eval()
    return model, message_length

def load_image(imgname, target_size=512) -> torch.Tensor:
    pil_img = Image.open(imgname).convert('RGB') if isinstance(imgname, str) else imgname
    tform = transforms.Compose(
        [
            transforms.Resize(target_size, antialias=True),
            transforms.CenterCrop(target_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
        ]
    )
    return tform(pil_img)[None, ...]

@torch.no_grad()
def main(ckpt_dir, df_image_file, device="cuda:0"):
    wm_model, message_length = load_wm_model(ckpt_dir=ckpt_dir)
    wm_model = wm_model.to(device)
    image_path = os.path.join(df_image_file)
    edited_wm_image = load_image(image_path).to(device)
    watermark = wm_model.decoder(edited_wm_image)
    rec_message = watermark.gt(0.5).int()

    img_name = df_image_file.split("/")[-1].split(".")[0]
    identifier = img_name.split("_")[-2]
    integer = int(identifier)
    bitstream = format(integer, f'0{message_length}b')
    org_message = torch.tensor([int(b) for b in bitstream], device=device).int()

    xor_result = (rec_message != org_message).int()
    num_errors = xor_result.sum().item()

    org_str = ''.join(map(str, org_message.tolist()))
    rec_str = ''.join(map(str, rec_message[0].tolist()))
    xor_str = ''.join(map(str, xor_result[0].tolist()))

    print(f"Image: {img_name}")

    print(org_str)
    print(rec_str)
    print(xor_str)
    print(f"Number of errors: {num_errors}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--ckpt_dir', type=str)
    parser.add_argument('--df_image_file', type=str)
    args = parser.parse_args()
    main(
        ckpt_dir=args.ckpt_dir, 
        df_image_file=args.df_image_file, 
        device='cuda:0'
    )