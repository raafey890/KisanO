#!/bin/sh
set -e

echo "[+] Starting KisanO Container Entrypoint..."

# Example: Run Database Migrations here if using Alembic
# echo "[+] Running database migrations..."
# alembic upgrade head

if [ "$ENVIRONMENT" = "production" ]; then
    echo "[+] Validating Production Environment Variables..."
    missing=0
    for var in SECRET_KEY MONGODB_URI CLOUDINARY_API_KEY RAZORPAY_KEY_ID; do
        if [ -z "$(eval echo \$$var)" ]; then
            echo "🔥 CRITICAL: Missing $var"
            missing=1
        fi
    done
    if [ $missing -eq 1 ]; then
        echo "🔥 CRITICAL: Failed Fast. Required environment variables missing."
        exit 1
    fi
fi

echo "[+] Handing over execution to CMD: $@"
exec "$@"
