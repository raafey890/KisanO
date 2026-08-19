#!/bin/bash
# =============================================================================
# KisanO — Enterprise Automated Database Backup Script
# Features: MongoDB dump, S3 upload, retention policy, integrity check
# Schedule: 0 2 * * * /opt/kisano/scripts/backup_db.sh >> /var/log/kisano-backup.log 2>&1
# =============================================================================
set -euo pipefail

# --- Configuration (override via environment or .env) ---
BACKUP_DIR="${BACKUP_DIR:-/opt/kisano/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
MONGO_CONTAINER="${MONGO_CONTAINER:-kisano-mongodb-1}"
DB_NAME="${MONGODB_DB_NAME:-kisano_production}"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/kisano_mongodb_${TIMESTAMP}.archive.gz"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
LOG_TAG="[BACKUP $(date '+%Y-%m-%d %H:%M:%S')]"
NOTIFY_WEBHOOK="${BACKUP_NOTIFY_WEBHOOK:-}"  # Optional Slack/Teams webhook

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

log()     { echo -e "${LOG_TAG} $*"; }
success() { log "${GREEN}[OK]${NC}   $*"; }
warn()    { log "${YELLOW}[WARN]${NC} $*"; }
error()   { log "${RED}[FAIL]${NC} $*"; }

notify() {
    local msg="$1"
    if [ -n "$NOTIFY_WEBHOOK" ]; then
        curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$msg\"}" "$NOTIFY_WEBHOOK" &>/dev/null || true
    fi
}

# ---------------------------------------------------------------------------
trap 'error "Backup FAILED at: $BASH_COMMAND"; notify "❌ KisanO DB Backup FAILED on $(hostname) at $TIMESTAMP"; exit 1' ERR
# ---------------------------------------------------------------------------

log "================================================"
log " KisanO MongoDB Backup — $TIMESTAMP"
log " Database      : $DB_NAME"
log " Output File   : $BACKUP_FILE"
log " Retention     : ${RETENTION_DAYS} days"
log " S3 Bucket     : ${S3_BUCKET:-not configured}"
log "================================================"

# --- Step 1: Create backup directory ---
mkdir -p "$BACKUP_DIR"
log "Backup directory: $BACKUP_DIR"

# --- Step 2: Check MongoDB container is running ---
if ! docker inspect "$MONGO_CONTAINER" &>/dev/null; then
    error "MongoDB container '$MONGO_CONTAINER' not found or not running."
    exit 1
fi

# --- Step 3: Dump MongoDB database ---
log "Creating MongoDB dump (compressed archive)..."
docker exec "$MONGO_CONTAINER" mongodump \
    --db "$DB_NAME" \
    --archive \
    --gzip \
    --quiet \
    | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
success "Dump complete → $BACKUP_FILE ($BACKUP_SIZE)"

# --- Step 4: Generate SHA-256 checksum for integrity verification ---
log "Generating SHA-256 checksum..."
sha256sum "$BACKUP_FILE" > "$CHECKSUM_FILE"
success "Checksum: $(cat "$CHECKSUM_FILE" | awk '{print $1}')"

# --- Step 5: Verify the archive is not empty / corrupt ---
log "Verifying archive integrity..."
if ! gzip -t "$BACKUP_FILE" 2>/dev/null; then
    error "Backup archive is corrupt! Aborting."
    rm -f "$BACKUP_FILE" "$CHECKSUM_FILE"
    exit 1
fi
success "Archive integrity verified."

# --- Step 6: Upload to S3 (if configured) ---
if [ -n "$S3_BUCKET" ]; then
    log "Uploading to S3: ${S3_BUCKET}..."
    if command -v aws &>/dev/null; then
        aws s3 cp "$BACKUP_FILE" "${S3_BUCKET}/$(basename "$BACKUP_FILE")" \
            --storage-class STANDARD_IA \
            --no-progress
        aws s3 cp "$CHECKSUM_FILE" "${S3_BUCKET}/$(basename "$CHECKSUM_FILE")" \
            --no-progress
        success "Uploaded to S3: ${S3_BUCKET}"
    else
        warn "aws CLI not found. Skipping S3 upload."
    fi
else
    warn "BACKUP_S3_BUCKET not set. Skipping S3 upload (local backup only)."
fi

# --- Step 7: Enforce retention policy (delete old local backups) ---
log "Enforcing retention policy (keep last $RETENTION_DAYS days)..."
DELETED_COUNT=$(find "$BACKUP_DIR" -name "*.archive.gz" -mtime "+${RETENTION_DAYS}" -print | wc -l)
find "$BACKUP_DIR" -name "*.archive.gz" -mtime "+${RETENTION_DAYS}" -exec rm -f {} \; || true
find "$BACKUP_DIR" -name "*.sha256" -mtime "+${RETENTION_DAYS}" -exec rm -f {} \; || true
success "Cleaned up $DELETED_COUNT expired backup(s)."

# --- Step 8: Log backup summary ---
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "*.archive.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "unknown")

log "================================================"
success " BACKUP COMPLETED SUCCESSFULLY"
log " File          : $(basename "$BACKUP_FILE")"
log " Size          : $BACKUP_SIZE"
log " Total Backups : $TOTAL_BACKUPS"
log " Total Storage : $TOTAL_SIZE"
log "================================================"

notify "✅ KisanO DB Backup successful on $(hostname): $(basename "$BACKUP_FILE") ($BACKUP_SIZE)"
