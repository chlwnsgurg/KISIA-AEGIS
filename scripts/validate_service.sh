#!/bin/bash

# Validate that the service is running correctly
echo "Validating Aegis backend service..."

# Wait for the service to start
sleep 30

# Check if container is running
if ! docker ps | grep -q aegis-backend; then
    echo "ERROR: Container is not running"
    exit 1
fi

# Check if the service responds to health check
for i in {1..10}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "Service is healthy"
        exit 0
    fi
    echo "Waiting for service to be ready... (attempt $i/10)"
    sleep 10
done

echo "ERROR: Service failed to start properly"
exit 1