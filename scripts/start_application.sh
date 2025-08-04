#!/bin/bash

# Start the new Docker container using deploy setup
echo "Starting Aegis backend application..."

# Change to deploy directory
cd /home/ubuntu/deploy

# Set default environment variables if not provided
export AWS_REGION=${AWS_REGION:-ap-northeast-2}
export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-425315269246}
export ECR_REPOSITORY_NAME=${ECR_REPOSITORY_NAME:-aegis1-test}
export ECR_REPOSITORY_ID=${ECR_REPOSITORY_ID:-$AWS_ACCOUNT_ID}
export ECR_REGION=${ECR_REGION:-$AWS_REGION}

# Set executable permissions for scripts
chmod +x ecr-login.sh

# ECR login
./ecr-login.sh

# Pull latest image from ECR
ECR_IMAGE_URL="$ECR_REPOSITORY_ID.dkr.ecr.$ECR_REGION.amazonaws.com/$ECR_REPOSITORY_NAME:latest"
echo "Pulling image: $ECR_IMAGE_URL"
docker pull $ECR_IMAGE_URL

# Start application with docker-compose
docker compose --profile app up -d

echo "Application started successfully"