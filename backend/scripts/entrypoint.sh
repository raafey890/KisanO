#!/bin/sh
set -e

echo "[+] Starting KisanO Container Entrypoint..."

# Example: Run Database Migrations here if using Alembic
# echo "[+] Running database migrations..."
# alembic upgrade head

echo "[+] Handing over execution to CMD: $@"
exec "$@"
