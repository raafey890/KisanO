#!/bin/bash
# =============================================================================
# KisanO — Certbot Auto-Renewal Script
# Should be run daily via cron: 0 3 * * * /app/deployment/nginx/certbot-renew.sh
# =============================================================================
set -euo pipefail

DOMAIN="${DOMAIN:-api.kisano.in}"
LOG_FILE="/var/log/certbot-renew.log"
NGINX_CONTAINER="${NGINX_CONTAINER:-kisano-nginx-1}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Certbot renewal check started ==="

# --- Attempt renewal ---
if certbot renew --webroot -w /var/www/certbot --quiet --no-eff-email; then
    log "[✓] Certificate renewal completed successfully"

    # --- Reload NGINX gracefully (zero-downtime) ---
    if docker inspect "$NGINX_CONTAINER" &>/dev/null; then
        log "[+] Reloading NGINX container: $NGINX_CONTAINER"
        docker exec "$NGINX_CONTAINER" nginx -s reload
        log "[✓] NGINX reloaded successfully"
    else
        log "[WARN] NGINX container '$NGINX_CONTAINER' not found. Skipping reload."
    fi
else
    log "[ERROR] Certificate renewal failed! Check: certbot renew --dry-run"
    exit 1
fi

log "=== Certbot renewal check finished ==="
