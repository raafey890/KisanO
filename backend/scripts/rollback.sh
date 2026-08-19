#!/bin/bash
# =============================================================================
# KisanO — Emergency Rollback Script
# Reverts to the previously running Docker image tag.
# Usage: bash scripts/rollback.sh [staging|production]
# =============================================================================
set -euo pipefail

ENVIRONMENT="${1:-production}"
COMPOSE_BASE="docker-compose.yml"
COMPOSE_ENV="docker-compose.${ENVIRONMENT}.yml"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="${PROJECT_DIR}/logs/rollback.log"
ROLLBACK_TAG_FILE="/tmp/kisano_rollback_${ENVIRONMENT}.tag"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

mkdir -p "$(dirname "$LOG_FILE")"

log() {
    local level="$1"; shift
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] $*" | tee -a "$LOG_FILE"
}
info()    { log "${YELLOW}INFO${NC}" "$@"; }
success() { log "${GREEN}SUCCESS${NC}" "$@"; }
error()   { log "${RED}ERROR${NC}" "$@"; }

cd "$PROJECT_DIR"

info "================================================"
info " KisanO Emergency Rollback"
info " Environment : $ENVIRONMENT"
info " Timestamp   : $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
info "================================================"

# --- Step 1: Retrieve rollback tag ---
if [ ! -f "$ROLLBACK_TAG_FILE" ]; then
    error "No rollback reference found at $ROLLBACK_TAG_FILE"
    error "Manual intervention required. Check: docker image ls | grep kisano"
    exit 1
fi

ROLLBACK_TAG=$(cat "$ROLLBACK_TAG_FILE")
info "Rolling back to image tag: $ROLLBACK_TAG"

if [ "$ROLLBACK_TAG" = "none" ] || [ -z "$ROLLBACK_TAG" ]; then
    error "Rollback tag is empty or 'none'. Cannot auto-rollback."
    error "Manual steps:"
    error "  1. docker image ls | grep kisano"
    error "  2. docker compose ... up -d --scale backend=0"
    error "  3. docker tag <previous_image> <current_image>"
    error "  4. docker compose ... up -d"
    exit 1
fi

# --- Step 2: Check if the rollback image exists locally ---
if ! docker image inspect "$ROLLBACK_TAG" &>/dev/null; then
    info "Rollback image not found locally. Attempting to pull from registry..."
    docker pull "$ROLLBACK_TAG" || {
        error "Failed to pull rollback image '$ROLLBACK_TAG'."
        exit 1
    }
fi

# --- Step 3: Override the image and restart ---
info "Restarting services with rollback image..."
# Force recreate using the previous image tag stored in the rollback file
KISANO_BACKEND_IMAGE="$ROLLBACK_TAG" \
    docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_ENV" \
    up -d --force-recreate --wait --wait-timeout 120

# --- Step 4: Validate rollback health ---
info "Validating rollback health..."
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    --max-time 10 "${HEALTH_CHECK_URL:-https://api.kisano.in}/health" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" -eq 200 ]; then
    success "Rollback successful! Service is healthy (HTTP $HTTP_STATUS)"
    success "⚠️  IMPORTANT: Investigate and fix the failed deployment before next push."
else
    error "Rollback health check failed (HTTP $HTTP_STATUS)!"
    error "CRITICAL: Manual intervention required immediately."
    error "  1. docker compose logs backend --tail=100"
    error "  2. Check /opt/kisano/logs/deploy.log"
    exit 1
fi

info "================================================"
info " ROLLBACK COMPLETE"
info " Reverted to: $ROLLBACK_TAG"
info "================================================"
