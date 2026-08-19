#!/bin/bash
# =============================================================================
# KisanO — SSL Certificate Initialization (Let's Encrypt / Certbot)
# Run this ONCE on a fresh server before starting nginx in production mode.
# =============================================================================
set -euo pipefail

# --- Configuration ---
DOMAIN="${DOMAIN:-api.kisano.in}"
EMAIL="${CERTBOT_EMAIL:-admin@kisano.in}"
STAGING="${CERTBOT_STAGING:-false}"  # Set to "true" to test with staging CA

echo "=============================================="
echo " KisanO SSL Setup — Let's Encrypt / Certbot"
echo "=============================================="
echo " Domain : $DOMAIN"
echo " Email  : $EMAIL"
echo " Staging: $STAGING"
echo "=============================================="

# --- Ensure certbot is available ---
if ! command -v certbot &>/dev/null; then
    echo "[ERROR] certbot not found. Install it via: sudo apt install certbot"
    exit 1
fi

# --- Create webroot directory for ACME challenge ---
WEBROOT="/var/www/certbot"
mkdir -p "$WEBROOT"
echo "[+] Created certbot webroot: $WEBROOT"

# --- Build certbot flags ---
STAGING_FLAG=""
if [ "$STAGING" = "true" ]; then
    STAGING_FLAG="--staging"
    echo "[WARN] Using Let's Encrypt STAGING environment (test only)"
fi

# --- Issue the certificate ---
echo "[+] Requesting certificate for $DOMAIN ..."
certbot certonly \
    --webroot \
    --webroot-path="$WEBROOT" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --domains "$DOMAIN" \
    --non-interactive \
    $STAGING_FLAG

echo "[✓] Certificate issued successfully!"
echo "    Certificate : /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "    Private Key : /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo ""
echo "  Next steps:"
echo "  1. Verify NGINX config points to these certificate paths"
echo "  2. Run: docker compose ... up -d"
echo "  3. Verify HTTPS: curl -I https://$DOMAIN/health"
