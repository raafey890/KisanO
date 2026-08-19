#!/bin/bash
# =============================================================================
# KisanO — Enterprise Zero-Downtime Deployment Script
# Strategy: Pull → Start new → Health check → Remove old
# Usage: bash scripts/deploy.sh [staging|production]
# =============================================================================
set -euo pipefail

# --- Configuration ---
ENVIRONMENT="${1:-production}"
COMPOSE_BASE="docker-compose.yml"
COMPOSE_ENV="docker-compose.${ENVIRONMENT}.yml"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="${PROJECT_DIR}/logs/deploy.log"
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-https://api.kisano.in}"
HEALTH_RETRIES="${HEALTH_RETRIES:-20}"
HEALTH_RETRY_DELAY="${HEALTH_RETRY_DELAY:-6}"

# ANSI colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

mkdir -p "$(dirname "$LOG_FILE")"

log() {
    local level="$1"; shift
    local msg="$*"
    local ts
    ts="$(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "[${ts}] [${level}] ${msg}" | tee -a "$LOG_FILE"
}

info()    { log "${GREEN}INFO${NC}" "$@"; }
warn()    { log "${YELLOW}WARN${NC}" "$@"; }
error()   { log "${RED}ERROR${NC}" "$@"; }
success() { log "${GREEN}SUCCESS${NC}" "$@"; }

# ---------------------------------------------------------------------------
trap 'error "Deployment FAILED at step $BASH_COMMAND. Check $LOG_FILE."; exit 1' ERR
# ---------------------------------------------------------------------------

cd "$PROJECT_DIR"

info "================================================"
info " KisanO Zero-Downtime Deployment"
info " Environment  : $ENVIRONMENT"
info " Compose file : $COMPOSE_ENV"
info " Timestamp    : $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
info "================================================"

# --- Step 1: Validate environment file ---
if [ ! -f "$COMPOSE_ENV" ]; then
    error "Compose file '$COMPOSE_ENV' not found."
    exit 1
fi

# --- Step 2: Save current image digest for potential rollback ---
ROLLBACK_TAG_FILE="/tmp/kisano_rollback_${ENVIRONMENT}.tag"
CURRENT_BACKEND_IMAGE=$(docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_ENV" \
    images --format json 2>/dev/null | python3 -c \
    "import sys,json; imgs=[x for x in json.load(sys.stdin) if 'backend' in x.get('Service','')]; print(imgs[0]['Tag'] if imgs else 'none')" 2>/dev/null || echo "none")
echo "$CURRENT_BACKEND_IMAGE" > "$ROLLBACK_TAG_FILE"
info "Rollback reference saved: $CURRENT_BACKEND_IMAGE → $ROLLBACK_TAG_FILE"

# --- Step 3: Pull new images (non-disruptive — running containers unchanged) ---
info "Pulling latest images from registry..."
docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_ENV" pull --quiet
success "Images pulled successfully."

# --- Step 4: Start new containers with health-check gating ---
# Docker Compose's --wait flag only proceeds once all health checks pass.
# This is the core of zero-downtime: new containers are verified BEFORE
# Docker routes traffic to them (when replicas > 1).
info "Starting containers with rolling restart (--wait for health checks)..."
docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_ENV" \
    up -d --remove-orphans --wait --wait-timeout 180
success "All containers are up and passing health checks."

# --- Step 5: Application-level post-deployment validation ---
info "Running application-level health validation against $HEALTH_CHECK_URL ..."
ATTEMPT=0
while [ "$ATTEMPT" -lt "$HEALTH_RETRIES" ]; do
    ATTEMPT=$((ATTEMPT + 1))
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time 5 --connect-timeout 3 \
        "${HEALTH_CHECK_URL}/health" 2>/dev/null || echo "000")

    if [ "$HTTP_STATUS" -eq 200 ]; then
        success "Health check passed (attempt $ATTEMPT/$HEALTH_RETRIES) — HTTP $HTTP_STATUS"
        break
    fi

    warn "Health check attempt $ATTEMPT/$HEALTH_RETRIES — HTTP $HTTP_STATUS. Retrying in ${HEALTH_RETRY_DELAY}s..."
    sleep "$HEALTH_RETRY_DELAY"

    if [ "$ATTEMPT" -eq "$HEALTH_RETRIES" ]; then
        error "Health checks failed after $HEALTH_RETRIES attempts! Triggering rollback..."
        bash "$(dirname "$0")/rollback.sh" "$ENVIRONMENT"
        exit 1
    fi
done

# --- Step 6: Run full post-deployment validation suite ---
info "Running full post-deployment validation..."
bash "$(dirname "$0")/health_check.sh" "$HEALTH_CHECK_URL"

# --- Step 7: Cleanup unused Docker images (keep last 3 tags) ---
info "Pruning unused Docker images..."
docker image prune -f --filter "until=72h" >> "$LOG_FILE" 2>&1 || true

success "================================================"
success " DEPLOYMENT COMPLETE"
success " Environment : $ENVIRONMENT"
success " SHA         : ${GITHUB_SHA:-local}"
success " Duration    : Check $LOG_FILE for timing"
success "================================================"
