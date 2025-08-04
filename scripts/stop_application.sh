#!/bin/bash

# Stop the running Docker containers using deploy setup
echo "Stopping existing Aegis backend application..."

# Change to deploy directory
cd /home/ubuntu/deploy || exit 1

# Stop containers using docker-compose
docker compose --profile app down

# Clean up unused images
docker image prune -f

echo "Application stopped successfully"