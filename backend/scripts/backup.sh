#!/bin/bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/kisano_db_${TIMESTAMP}.archive"

mkdir -p $BACKUP_DIR

echo "Starting MongoDB backup..."

# Assuming mongodb runs inside docker network
docker exec kisano-mongo-1 mongodump --archive --gzip > "$BACKUP_FILE"

echo "Backup created successfully at $BACKUP_FILE"

# Optional: Sync to S3
# aws s3 cp "$BACKUP_FILE" s3://kisano-backups/db/

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -name "*.archive" -mtime +7 -exec rm {} \;
echo "Old backups cleaned up."
