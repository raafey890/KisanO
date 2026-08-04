#!/bin/bash
set -e

echo "Starting deployment of KisanO Backend..."

# Load environment variables
if [ -f .env.prod ]; then
  export $(cat .env.prod | grep -v '#' | awk '/=/ {print $1}')
else
  echo ".env.prod file not found. Deployment aborted."
  exit 1
fi

echo "Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "Cleaning up old images..."
docker image prune -f

echo "Deployment completed successfully!"
bash scripts/healthcheck.sh
