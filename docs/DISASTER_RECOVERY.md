# KisanO Disaster Recovery Guide

## 1. Automated Backups
In `docker-compose.prod.yml`, the `db-backup` container runs a daily cron job that executes `mongodump` and archives the database to the `db_backups` Docker volume.

## 2. Restoring from Backup
If the primary database crashes or gets corrupted, follow these steps to restore:

1. Locate the backup folder on the host:
   ```bash
   docker volume inspect kisano_db_backups
   ```
2. Identify the desired timestamped backup folder (e.g., `2024-05-20`).
3. Execute `mongorestore` inside the MongoDB container:
   ```bash
   docker exec -it kisano-mongodb-1 mongorestore --uri="mongodb://localhost:27017/" /backups/2024-05-20 --gzip --drop
   ```
   *(Note: The `--drop` flag will replace existing data with the backup).*

## 3. Server Failure (Total Loss)
If the VPS is destroyed:
1. Provision a new VPS.
2. Clone the repository and copy the saved `.env` and SSL certificates.
3. If using MongoDB Atlas / Redis Cloud, simply run `docker compose up -d` and the system is fully restored instantly.
4. If using local databases, transfer the off-site `db_backups` archive to the new server and run `mongorestore`.

## 4. Rollback Strategy
If a new release causes critical bugs:
1. GitHub Actions automatically tags the previous working image as `kisano-backend:previous`.
2. To rollback manually:
   ```bash
   docker tag kisano-backend:previous kisano-backend:latest
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```
