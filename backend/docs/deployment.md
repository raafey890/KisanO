# KisanO Production Deployment Guide

This document outlines the architecture, setup, and operational procedures for running the KisanO platform in production.

## 1. Infrastructure Overview

The production environment is orchestrated using Docker and Docker Compose. It provisions:
- **FastAPI Backend (Gunicorn/Uvicorn)**
- **MongoDB** (Primary Database)
- **Redis** (Caching, Queue limits, Rate Limiting)
- **Nginx** (Reverse Proxy, SSL Termination, Load Balancing)
- **Prometheus & Grafana** (Metrics, Observability, Alerting)

## 2. Prerequisites

- A Linux server (Ubuntu 22.04 LTS recommended)
- Docker Engine & Docker Compose v2 installed
- A valid domain name pointing to the server IP (e.g. `api.kisano.com`)
- GitHub Secrets configured (for CI/CD)

## 3. Deployment via GitHub Actions (CI/CD)

Deployments are entirely automated.

1. **Continuous Integration (`ci.yml`)**: On every push or PR to `main`, GitHub Actions spins up MongoDB and Redis, installs dependencies, runs `flake8` for linting, `mypy` for static types, and `pytest` for unit/integration tests with coverage.
2. **Continuous Deployment (`cd.yml`)**: When a release tag (e.g., `v1.2.0`) is pushed, the CD pipeline builds a production-optimized Docker image, pushes it to DockerHub, and securely SSHs into the production server to run the `deploy.sh` script.

## 4. Manual Deployment

If you need to deploy manually:

```bash
# 1. Pull the repository
git pull origin main

# 2. Set environment variables
cp .env.example .env.prod
nano .env.prod

# 3. Run the deployment script
bash scripts/deploy.sh
```

## 5. Security & Hardening

- **Non-Root Execution**: The backend `Dockerfile` creates an isolated `appuser` so the API does not run as root.
- **Nginx Protection**: Limits requests to 10/second per IP to prevent DDoS, drops massive file uploads (>50MB), and injects strict security headers (HSTS, X-Frame-Options, X-XSS-Protection).
- **Environment Isolation**: The multi-stage Docker build ensures development tools (`pytest`, `mypy`) and source code histories are stripped from the final production container.

## 6. Observability

- **Prometheus**: Scrapes `/metrics` from the FastAPI application every 15 seconds.
- **Grafana**: Accessible on port `3000`. Connect Prometheus as the data source to visualize API Latency, Error Rates, and Request Volume.

## 7. Disaster Recovery & Backups

Backups should be executed daily via cron job:

```bash
# Add to crontab: 0 2 * * * /opt/kisano/backend/scripts/backup.sh
bash scripts/backup.sh
```

**To Restore:**
```bash
bash scripts/restore.sh backups/kisano_db_YYYYMMDD.archive
```

## 8. Rollback Procedures

If a deployment fails, the `healthcheck.sh` script will alert you. To rollback:
```bash
git checkout v1.1.0  # Checkout the previous stable tag
bash scripts/deploy.sh
```
