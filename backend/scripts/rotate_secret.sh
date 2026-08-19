#!/bin/bash
# =============================================================================
# KisanO — Secret Rotation Script
# Rotates a single secret across the .env file and restarts affected services.
# Usage: bash scripts/rotate_secret.sh <SECRET_NAME> <NEW_VALUE> [environment]
# Example: bash scripts/rotate_secret.sh SECRET_KEY "$(openssl rand -hex 32)" production
#
# This script NEVER logs the secret value — only the key name and timestamp.
# =============================================================================
set -euo pipefail

SECRET_NAME="${1:-}"
NEW_VALUE="${2:-}"
ENVIRONMENT="${3:-production}"
COMPOSE_BASE="docker-compose.yml"
COMPOSE_ENV="docker-compose.${ENVIRONMENT}.yml"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${PROJECT_DIR}/.env"
BACKUP_DIR="${PROJECT_DIR}/.env_backups"
LOG_FILE="${PROJECT_DIR}/logs/secret_rotation.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

mkdir -p "$(dirname "$LOG_FILE")" "$BACKUP_DIR"

log()     { echo -e "[${TIMESTAMP}] $*" | tee -a "$LOG_FILE"; }
success() { log "${GREEN}[OK]${NC}   $*"; }
warn()    { log "${YELLOW}[WARN]${NC} $*"; }
error()   { log "${RED}[FAIL]${NC} $*"; }

# --- Validate arguments ---
if [ -z "$SECRET_NAME" ] || [ -z "$NEW_VALUE" ]; then
    echo "Usage: bash scripts/rotate_secret.sh <SECRET_NAME> <NEW_VALUE> [environment]"
    echo ""
    echo "Examples:"
    echo "  bash scripts/rotate_secret.sh SECRET_KEY \"\$(openssl rand -hex 32)\" production"
    echo "  bash scripts/rotate_secret.sh MONGODB_URL \"mongodb+srv://...\" production"
    echo "  bash scripts/rotate_secret.sh REDIS_URL \"redis://:newpass@redis:6379/0\" production"
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    error ".env file not found at $ENV_FILE"
    exit 1
fi

log "================================================"
log " KisanO Secret Rotation"
log " Secret     : $SECRET_NAME"
log " Value      : [REDACTED — never logged]"
log " Environment: $ENVIRONMENT"
log " Timestamp  : $TIMESTAMP"
log "================================================"

# --- Step 1: Backup current .env ---
BACKUP_FILE="${BACKUP_DIR}/.env.backup.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
# Restrict backup permissions — readable only by current user
chmod 600 "$BACKUP_FILE"
success "Backup created: $BACKUP_FILE"

# --- Step 2: Verify the key exists in .env ---
if ! grep -q "^${SECRET_NAME}=" "$ENV_FILE" 2>/dev/null; then
    warn "Key '$SECRET_NAME' not found in .env. Adding it as a new entry."
    echo "${SECRET_NAME}=${NEW_VALUE}" >> "$ENV_FILE"
    success "Key '$SECRET_NAME' added to .env"
else
    # --- Step 3: Rotate the value using sed ---
    # Use a temp file to ensure atomic write
    TEMP_FILE=$(mktemp)
    # Replace the value; handles values containing special characters via the temp approach
    while IFS= read -r line; do
        if [[ "$line" =~ ^${SECRET_NAME}= ]]; then
            echo "${SECRET_NAME}=${NEW_VALUE}"
        else
            echo "$line"
        fi
    done < "$ENV_FILE" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    success "Key '$SECRET_NAME' rotated in .env"
fi

# --- Step 4: Determine which services need restarting ---
declare -A SERVICE_MAP=(
    ["SECRET_KEY"]="backend worker"
    ["MONGODB_URL"]="backend worker scheduler"
    ["MONGODB_DB_NAME"]="backend worker scheduler"
    ["REDIS_URL"]="backend worker scheduler"
    ["CLOUDINARY_CLOUD_NAME"]="backend"
    ["CLOUDINARY_API_KEY"]="backend"
    ["CLOUDINARY_API_SECRET"]="backend"
    ["RAZORPAY_KEY_ID"]="backend"
    ["RAZORPAY_KEY_SECRET"]="backend"
    ["RAZORPAY_WEBHOOK_SECRET"]="backend"
    ["MSG91_AUTH_KEY"]="backend"
    ["GEMINI_API_KEY"]="backend"
    ["SMTP_PASSWORD"]="backend worker"
    ["FIREBASE_CREDENTIALS_JSON_PATH"]="backend"
)

SERVICES_TO_RESTART="${SERVICE_MAP[$SECRET_NAME]:-backend}"
log "Services requiring restart: $SERVICES_TO_RESTART"

# --- Step 5: Rolling restart of affected services ---
cd "$PROJECT_DIR"
log "Performing rolling restart of: $SERVICES_TO_RESTART ..."

# shellcheck disable=SC2086
docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_ENV" \
    up -d --force-recreate --wait $SERVICES_TO_RESTART

success "Services restarted successfully."

# --- Step 6: Health validation after rotation ---
log "Running health check post-rotation..."
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    --max-time 10 "http://localhost:8000/health" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" -eq 200 ]; then
    success "Health check passed (HTTP $HTTP_STATUS) — rotation complete."
else
    error "Health check FAILED (HTTP $HTTP_STATUS) after rotation!"
    warn "Restoring backup .env from $BACKUP_FILE ..."
    cp "$BACKUP_FILE" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    # shellcheck disable=SC2086
    docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_ENV" \
        up -d --force-recreate --wait $SERVICES_TO_RESTART
    error "Rotation ROLLED BACK. Investigate before retrying."
    exit 1
fi

log "================================================"
success " SECRET ROTATION COMPLETE"
log " Key rotated : $SECRET_NAME"
log " Backup at   : $BACKUP_FILE"
log " Timestamp   : $TIMESTAMP"
log " REMINDER    : Update this secret in GitHub Secrets and Render Env Group"
log "================================================"
