#!/bin/bash
# Restore Manager
set -e

ENV=$1
ARCHIVE_NAME=$2
BACKUP_DIR="../backup/archives"

if [ -z "$ARCHIVE_NAME" ]; then
    echo "Usage: ./restore.sh <env> <archive_name>"
    exit 1
fi

ARCHIVE_PATH="$BACKUP_DIR/$ARCHIVE_NAME"
if [ ! -f "$ARCHIVE_PATH" ]; then
    echo "Archive not found: $ARCHIVE_PATH"
    exit 1
fi

echo "Initiating Restore for environment: $ENV from $ARCHIVE_NAME"

# 1. Prevent traffic during restore
echo "Shutting down API containers to prevent data inconsistency..."
docker compose stop backend worker scheduler

# 2. MongoDB Restore
echo "Copying archive to MongoDB container..."
docker compose cp "$ARCHIVE_PATH" mongodb:/tmp/$ARCHIVE_NAME

echo "Restoring MongoDB via mongorestore..."
docker compose exec -T mongodb mongorestore \
    --uri="mongodb://root:example@localhost:27017/kisano?authSource=admin" \
    --archive="/tmp/$ARCHIVE_NAME" \
    --gzip \
    --drop # Drop existing collections before restore

# 3. Bring traffic back up
echo "Restarting API containers..."
docker compose start backend worker scheduler

# 4. Verification
echo "Verifying restore health..."
bash $(dirname "$0")/healthcheck.sh "$ENV"

echo "Restore completed successfully."
