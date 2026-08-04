#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file.archive>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will overwrite the current database."
read -p "Are you sure you want to proceed? (y/n): " confirm
if [ "$confirm" != "y" ]; then
  echo "Restore aborted."
  exit 0
fi

echo "Starting restore..."
docker exec -i kisano-mongo-1 mongorestore --archive --gzip --drop < "$BACKUP_FILE"

echo "Restore completed successfully!"
