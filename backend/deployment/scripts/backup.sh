#!/bin/bash
# Backup Manager
set -e

ENV=$1
BACKUP_DIR="../backup/archives"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
ARCHIVE_NAME="kisano_mongodb_$DATE.archive"

echo "Initiating Backup for environment: $ENV"

mkdir -p "$BACKUP_DIR"

# 1. MongoDB Backup
echo "Dumping MongoDB via mongodump..."
# Assuming 'mongodb' is the docker compose service name
docker compose exec -T mongodb mongodump \
    --uri="mongodb://root:example@localhost:27017/kisano?authSource=admin" \
    --archive="/tmp/$ARCHIVE_NAME" \
    --gzip

docker compose cp mongodb:/tmp/$ARCHIVE_NAME "$BACKUP_DIR/$ARCHIVE_NAME"

# 2. Redis Snapshot
echo "Triggering Redis BGSAVE..."
docker compose exec -T redis redis-cli BGSAVE

# 3. Future Cloud Hooks
echo "Ready for S3 upload..."
# aws s3 cp "$BACKUP_DIR/$ARCHIVE_NAME" "s3://kisano-backups/$ENV/$ARCHIVE_NAME"

# 4. Retention Policy
echo "Cleaning up backups older than 7 days..."
find "$BACKUP_DIR" -type f -name "*.archive" -mtime +7 -delete

echo "Backup completed: $ARCHIVE_NAME"
