# Deployment Guide

This How-To guide explains how to deploy the KisanO Backend using our `deployment_engine.sh` facade.

## Prerequisites
- Docker & Docker Compose installed.
- A populated `.env` file at the root of the project.

## Standard Deployment
The `deploy.sh` manager handles zero-downtime rolling updates.

```bash
cd deployment/scripts/
./deployment_engine.sh deploy production
```

## Behind the Scenes
1. The script pulls the latest Docker images.
2. It executes `docker compose up -d --build --no-deps backend worker`.
3. It aggressively polls the `/health` endpoint for 30 seconds.
4. If the health check fails, it triggers an **Automatic Rollback** via `rollback.sh`.

## Rolling Back Manually
If you discover a logical bug in production *after* a successful deployment, manually trigger the rollback manager:
```bash
./deployment/scripts/deployment_engine.sh rollback production
```
