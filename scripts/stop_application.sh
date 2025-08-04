#!/bin/bash

# Stop the running Docker container
echo "Stopping existing Aegis backend application..."

# Stop and remove existing container
docker stop aegis-backend || true
docker rm aegis-backend || true

# Remove old images (keep latest 3)
docker images | grep aegis-backend | tail -n +4 | awk '{print $3}' | xargs -r docker rmi || true

echo "Application stopped successfully"