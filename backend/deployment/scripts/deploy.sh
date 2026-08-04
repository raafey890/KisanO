#!/bin/bash
# Deployment Manager
set -e

ENV=$1
echo "Starting deployment for environment: $ENV"

# 1. Configuration Validation
if [ ! -f "../../.env" ]; then
    echo "Warning: .env file not found. Assuming environment variables are injected via CI/CD."
fi

# 2. Pull latest images
echo "Pulling latest Docker images..."
docker compose pull

# 3. Graceful Rolling Update (Zero Downtime hook)
echo "Executing rolling update..."
docker compose up -d --build --no-deps backend worker scheduler nginx

# 4. Health Verification Engine
echo "Verifying deployment health..."
sleep 5 # Wait for containers to boot
max_retries=10
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if curl -s -f http://localhost/health > /dev/null; then
        echo "Deployment successful. API is healthy."
        exit 0
    fi
    echo "Health check failed. Retrying in 3 seconds..."
    sleep 3
    retry_count=$((retry_count+1))
done

echo "CRITICAL: Health check failed after $max_retries attempts. Triggering rollback..."
bash $(dirname "$0")/rollback.sh "$ENV"
exit 1
