#!/bin/bash

# Start the new Docker container
echo "Starting Aegis backend application..."

# Pull the latest image from ECR
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
docker pull ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest

# Start the new container
docker run -d \
  --name aegis-backend \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest

echo "Application started successfully"