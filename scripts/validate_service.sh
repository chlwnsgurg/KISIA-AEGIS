#!/bin/bash

# Validate that the service is running correctly
echo "Validating Aegis backend service..."

# Wait for the service to start
sleep 30

# Check if backend container is running
if ! docker ps | grep -q aegis-backend; then
    echo "ERROR: Backend container is not running"
    echo "=== Docker container status ==="
    docker ps -a
    echo "=== Docker compose logs ==="
    cd /home/ubuntu/deploy && docker compose --profile app logs --tail=50
    exit 1
fi

# Check if nginx container is running
if ! docker ps | grep -q aegis-nginx; then
    echo "ERROR: Nginx container is not running"
    exit 1
fi

# Check if the service responds to health check via nginx (HTTPS)
for i in {1..10}; do
    if curl -f -k https://localhost/health > /dev/null 2>&1; then
        echo "Service is healthy via HTTPS"
        exit 0
    fi
    # Fallback to HTTP if HTTPS fails
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "Service is healthy via HTTP"
        exit 0
    fi
    echo "Waiting for service to be ready... (attempt $i/10)"
    sleep 10
done

echo "ERROR: Service failed to start properly"
exit 1