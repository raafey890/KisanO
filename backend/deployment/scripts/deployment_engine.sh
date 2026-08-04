#!/bin/bash
# Unified Deployment Engine Facade
# Routes all operational commands to the appropriate manager script.

COMMAND=$1
ENV=${2:-development}

if [ -z "$COMMAND" ]; then
    echo "Usage: ./deployment_engine.sh [deploy|rollback|backup|restore|health] [environment]"
    exit 1
fi

SCRIPT_DIR=$(dirname "$0")

case $COMMAND in
    deploy)
        bash "$SCRIPT_DIR/deploy.sh" "$ENV"
        ;;
    rollback)
        bash "$SCRIPT_DIR/rollback.sh" "$ENV"
        ;;
    backup)
        bash "$SCRIPT_DIR/backup.sh" "$ENV"
        ;;
    restore)
        # Restore needs a timestamp/archive arg, passing remaining args
        bash "$SCRIPT_DIR/restore.sh" "$ENV" "${@:3}"
        ;;
    health)
        # Basic HTTP check
        curl -f http://localhost/health || exit 1
        echo "Health check passed."
        ;;
    *)
        echo "Unknown command: $COMMAND"
        exit 1
        ;;
esac
