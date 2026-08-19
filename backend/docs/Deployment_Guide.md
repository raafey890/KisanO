# KisanO — Production Deployment Guide

**Version:** 2.0 | **Phase:** 12 | **Last Updated:** 2026-08-16

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [First-Time Server Setup](#first-time-server-setup)
3. [Environment Configuration](#environment-configuration)
4. [SSL Certificate Setup](#ssl-certificate-setup)
5. [Deploying the Application](#deploying-the-application)
6. [Render.com Deployment](#rendercom-deployment)
7. [Verifying the Deployment](#verifying-the-deployment)
8. [Kubernetes Readiness Notes](#kubernetes-readiness-notes)
9. [API Gateway Integration](#api-gateway-integration)

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Docker Engine | ≥ 24.0 | Install via `curl -fsSL https://get.docker.com \| sh` |
| Docker Compose | ≥ 2.20 | Bundled with Docker Engine |
| Ubuntu | 22.04 LTS | Recommended OS |
| RAM | ≥ 4 GB | 8 GB recommended for production |
| Disk | ≥ 40 GB SSD | For database + backups |
| Domain | DNS configured | `api.kisano.in` → server IP |

---

## First-Time Server Setup

```bash
# 1. Update the system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker

# 3. Install AWS CLI (for S3 backup uploads)
sudo apt install -y awscli

# 4. Clone the repository
git clone https://github.com/your-org/kisano.git /opt/kisano
cd /opt/kisano/backend

# 5. Create required directories
mkdir -p logs backups

# 6. Make all scripts executable
chmod +x scripts/*.sh deployment/nginx/*.sh
```

---

## Environment Configuration

```bash
# 1. Create production .env from the template
cp .env.production.example .env

# 2. Generate a secure SECRET_KEY
openssl rand -hex 32

# 3. Edit the file and fill in ALL required values
nano .env
# Required: MONGODB_URL, SECRET_KEY, REDIS_URL, CLOUDINARY_*, RAZORPAY_*, MSG91_*, GEMINI_API_KEY

# 4. Verify no placeholder values remain
grep "REPLACE_WITH\|your_.*_here\|<.*>" .env && echo "⚠️ PLACEHOLDERS FOUND" || echo "✓ No placeholders"
```

> **Security:** Never commit `.env` to Git. The `.gitignore` blocks it, but double-check with `git status`.

---

## SSL Certificate Setup

> Run this **before** starting production NGINX for the first time.

```bash
# Set your domain and email
export DOMAIN=api.kisano.in
export CERTBOT_EMAIL=admin@kisano.in

# Start NGINX in HTTP-only mode first (for ACME challenge)
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d nginx

# Issue the certificate
bash deployment/nginx/ssl_setup.sh

# Switch to production HTTPS mode
docker compose -f docker-compose.yml -f docker-compose.staging.yml down
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verify HTTPS
curl -I https://api.kisano.in/health
```

**Auto-renewal cron** (add to `/etc/cron.d/kisano-certbot`):
```
0 3 * * * root /opt/kisano/backend/deployment/nginx/certbot-renew.sh >> /var/log/kisano-certbot.log 2>&1
```

---

## Deploying the Application

### Standard Deployment (VPS / Docker Compose)

```bash
cd /opt/kisano/backend

# Deploy to production (zero-downtime)
bash scripts/deploy.sh production

# Or manual compose command:
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  pull && \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  up -d --remove-orphans --wait
```

### CI/CD Automated Deployment

Pushes to `main` branch trigger the GitHub Actions CD pipeline automatically:
1. Docker Build & Package workflow builds and pushes the image to GHCR
2. CD workflow deploys to staging, runs health checks
3. After manual approval in GitHub, deploys to production
4. On failure, rollback is triggered automatically

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `PROD_HOST` | Production server IP |
| `PROD_USER` | SSH username |
| `PROD_SSH_KEY` | Private SSH key (PEM format) |
| `STAGING_HOST` | Staging server IP |
| `STAGING_USER` | SSH username |
| `STAGING_SSH_KEY` | Private SSH key |

---

## Render.com Deployment

1. Fork the repository and connect it to Render
2. Create an **Env Group** named `kisano-secrets` in the Render Dashboard
3. Add all sensitive values (MongoDB URL, Secret Key, etc.) to the env group
4. Push the `render.yaml` — Render auto-provisions all three services
5. Monitor the deploy log in the Render Dashboard

> Render uses the `healthCheckPath: /health` to gate deployments. A failed health check automatically rolls back.

---

## Verifying the Deployment

```bash
# Run the full validation suite
bash scripts/health_check.sh https://api.kisano.in

# Quick spot checks
curl -s https://api.kisano.in/health | python3 -m json.tool
curl -I https://api.kisano.in/health | grep -E "HTTP|Strict-Transport|X-Frame"
curl -s https://api.kisano.in/openapi.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('API version:', d['info']['version'])"

# Container status
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=50 backend
```

---

## Kubernetes Readiness Notes

The current Docker architecture is **K8s-compatible without code changes**:

| K8s Concept | Current Implementation |
|-------------|----------------------|
| Pod Health | `HEALTHCHECK` in Dockerfile → K8s `livenessProbe` / `readinessProbe` |
| Config | All config via env vars → K8s `ConfigMap` + `Secret` |
| Service Discovery | Docker DNS `backend:8000` → K8s `Service` name |
| Non-root | `USER kisano` (UID 1001) in Dockerfile → Compliant with K8s PSP |
| Stateless | No local disk writes → K8s Pods restart cleanly |
| Scaling | `replicas` in compose → K8s `Deployment.spec.replicas` |
| Secrets | `.env` → K8s `Secret` objects injected as env vars |

**Migration path:** When ready, run `kompose convert` on the Docker Compose files to generate initial Kubernetes manifests.

---

## API Gateway Integration

The API is pre-configured for transparent API gateway insertion:

- All routing is done at the **NGINX level** — gateway sits in front of NGINX
- Authentication headers (`Authorization`, `X-API-Key`) pass through untouched
- Rate limiting is at NGINX — gateway rate limiting is **additive**
- Health endpoint (`/health`) is unauthenticated for gateway health probes
- CORS is configured at the FastAPI level — gateway CORS is **additive**
- All routes follow `/api/v{version}/` pattern — compatible with path-based routing

**Insertion point for Kong/Traefik:**
```
Client → [Kong/Traefik Gateway] → [NGINX] → [FastAPI]
```
No application code changes required.
