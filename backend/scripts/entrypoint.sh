#!/bin/sh
set -e

echo "[+] Starting KisanO Container Entrypoint..."

# Example: Run Database Migrations here if using Alembic
# echo "[+] Running database migrations..."
# alembic upgrade head

if [ "$ENVIRONMENT" = "production" ]; then
    echo "[+] Validating Production Environment Variables..."
    missing_req=0
    for var in SECRET_KEY MONGODB_URI; do
        if [ -z "$(eval echo \$$var)" ]; then
            echo "🔥 CRITICAL: Missing $var"
            missing_req=1
        fi
    done
    
    if [ $missing_req -eq 1 ]; then
        echo "🔥 CRITICAL: Failed Fast. Required environment variables missing."
        exit 1
    fi

    # Warnings for optional
    for var in REDIS_URL CLOUDINARY_API_KEY RAZORPAY_KEY_ID MSG91_AUTH_KEY GEMINI_API_KEY FIREBASE_CREDENTIALS_JSON_PATH; do
        if [ -z "$(eval echo \$$var)" ]; then
            echo "⚠️ WARNING: Optional variable $var is missing. Related features will be disabled or fall back to mock implementations."
        fi
    done
fi

echo "[+] Handing over execution to CMD: $@"
exec "$@"
