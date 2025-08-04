#!/bin/bash

# ECR 로그인 스크립트
echo "Logging into ECR..."

# Set default values if not provided
export AWS_REGION=${AWS_REGION:-ap-northeast-2}
export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-425315269246}

# AWS 환경변수가 설정되어 있는지 확인
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "ERROR: AWS credentials not set in environment"
    exit 1
fi

# ECR 로그인
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if [ $? -eq 0 ]; then
    echo "Successfully logged into ECR"
else
    echo "ERROR: Failed to login to ECR"
    exit 1
fi