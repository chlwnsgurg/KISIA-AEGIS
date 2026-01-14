# Script Name: inference.sh
# Description: generate the watermarked image
# Author: Runyi Hu
# Date: 2024-10-15

python inference.py --ckpt_dir './checkpoints' --image_file './test_data/Gadot.png' --output_dir './test_out'
