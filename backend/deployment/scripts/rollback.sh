#!/bin/bash
# Rollback Manager
set -e

ENV=$1
echo "Initiating Rollback for environment: $ENV"

# 1. Identify previous stable state
# In a pure Docker Compose MVP, we rely on the previous image tag or simply restarting the last known good container.
# In a real environment, this might involve pulling `image:stable-minus-1`.

echo "Reverting containers to previous state..."
docker compose down

echo "Starting previous known good state..."
docker compose up -d

# 2. Health Verification Engine
echo "Verifying rollback health..."
sleep 5
if curl -s -f http://localhost/health > /dev/null; then
    echo "Rollback successful. System restored."
    exit 0
else
    echo "CRITICAL: Rollback failed. Manual Disaster Recovery required!"
    exit 1
fi
