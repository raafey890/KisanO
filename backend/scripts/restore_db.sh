#!/bin/bash
# =============================================================================
# KisanO — Database Restore Script
# Restores a MongoDB backup archive with integrity check.
# Usage: bash scripts/restore_db.sh <backup_file.archive.gz> [--force]
# =============================================================================
set -euo pipefail

BACKUP_FILE="${1:-}"
FORCE="${2:-}"
MONGO_CONTAINER="${MONGO_CONTAINER:-kisano-mongodb-1}"
DB_NAME="${MONGODB_DB_NAME:-kisano_production}"
LOG_TAG="[RESTORE $(date '+%Y-%m-%d %H:%M:%S')]"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()     { echo -e "${LOG_TAG} $*"; }
success() { log "${GREEN}[OK]${NC}   $*"; }
warn()    { log "${YELLOW}[WARN]${NC} $*"; }
error()   { log "${RED}[FAIL]${NC} $*"; }

# --- Validate arguments ---
if [ -z "$BACKUP_FILE" ]; then
    error "Usage: bash scripts/restore_db.sh <backup_file.archive.gz> [--force]"
    error "Example: bash scripts/restore_db.sh /opt/kisano/backups/kisano_mongodb_2026-08-16_02-00-00.archive.gz"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    # Try downloading from S3 if not local
    if [[ "$BACKUP_FILE" == s3://* ]] && command -v aws &>/dev/null; then
        log "Downloading from S3: $BACKUP_FILE ..."
        LOCAL_FILE="/tmp/kisano_restore_$(basename "$BACKUP_FILE")"
        aws s3 cp "$BACKUP_FILE" "$LOCAL_FILE"
        BACKUP_FILE="$LOCAL_FILE"
    else
        error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

log "================================================"
log " KisanO Database Restore"
log " Backup File   : $BACKUP_FILE"
log " Database      : $DB_NAME"
log " Container     : $MONGO_CONTAINER"
log "================================================"

# --- Step 1: Verify archive integrity ---
log "Verifying archive integrity (SHA-256)..."
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [ -f "$CHECKSUM_FILE" ]; then
    if sha256sum -c "$CHECKSUM_FILE" --quiet 2>/dev/null; then
        success "Checksum verified."
    else
        error "CHECKSUM MISMATCH! The backup file may be corrupt."
        exit 1
    fi
else
    warn "No checksum file found at $CHECKSUM_FILE. Proceeding without verification."
fi

if ! gzip -t "$BACKUP_FILE" 2>/dev/null; then
    error "Archive is corrupt (gzip test failed)."
    exit 1
fi
success "Archive is valid."

# --- Step 2: Confirm restore (safety gate) ---
if [ "$FORCE" != "--force" ]; then
    echo ""
    warn "⚠️  WARNING: This will DROP and REPLACE the '$DB_NAME' database."
    warn "   This action is IRREVERSIBLE."
    warn "   Ensure you have a current backup before proceeding."
    echo ""
    read -r -p "Type 'yes' to confirm restore: " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        log "Restore aborted by user."
        exit 0
    fi
fi

# --- Step 3: Verify MongoDB container is running ---
if ! docker inspect "$MONGO_CONTAINER" &>/dev/null; then
    error "MongoDB container '$MONGO_CONTAINER' not found or not running."
    exit 1
fi

# --- Step 4: Take a pre-restore safety backup ---
log "Creating pre-restore safety backup..."
PRE_RESTORE_FILE="/tmp/kisano_pre_restore_$(date +%Y%m%d_%H%M%S).archive.gz"
docker exec "$MONGO_CONTAINER" mongodump \
    --db "$DB_NAME" --archive --gzip --quiet \
    | gzip > "$PRE_RESTORE_FILE" || warn "Pre-restore backup failed (database may be empty)"
success "Pre-restore backup: $PRE_RESTORE_FILE"

# --- Step 5: Restore the archive ---
log "Restoring database from: $(basename "$BACKUP_FILE") ..."
zcat "$BACKUP_FILE" | docker exec -i "$MONGO_CONTAINER" mongorestore \
    --archive \
    --gzip \
    --drop \
    --db "$DB_NAME" \
    --quiet

success "Database restored successfully."

# --- Step 6: Verify restore ---
log "Verifying restore — checking document count..."
DOC_COUNT=$(docker exec "$MONGO_CONTAINER" mongosh "$DB_NAME" --quiet \
    --eval "db.stats().objects" 2>/dev/null || echo "unknown")
success "Documents in database after restore: $DOC_COUNT"

log "================================================"
success " RESTORE COMPLETE"
log " Database : $DB_NAME"
log " Restored : $(basename "$BACKUP_FILE")"
log " Safety backup : $PRE_RESTORE_FILE"
log "================================================"
log "Next: Restart the backend to clear any caches:"
log "  docker compose restart backend"
