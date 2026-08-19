# KisanO — Environment Setup Guide

**Version:** 2.0 | **Last Updated:** 2026-08-16

---

## Overview

KisanO Backend supports three environments:

| Environment | Purpose | Config File | Notes |
|-------------|---------|-------------|-------|
| `development` | Local development | `.env` | Debug on, embedded workers |
| `staging` | Pre-production testing | `.env` (staging values) | Mirrors production config |
| `production` | Live system | `.env` (production values) | Secrets via GitHub/Render |

---

## Development Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-org/kisano.git
cd kisano/backend

# Create Python virtual environment
python3.11 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Create your local .env from the template
cp .env.example .env

# Edit with your local values
# Minimum required for local development:
# SECRET_KEY — any random string works locally
# MONGODB_URL — leave as default for docker-compose
# REDIS_URL — leave as default for docker-compose
nano .env
```

### 3. Start Infrastructure Services

```bash
# Start MongoDB and Redis only (not the full stack)
docker compose up mongodb redis -d

# Verify
docker compose ps
```

### 4. Run the Backend

```bash
# Start the FastAPI development server (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API docs available at:
# http://localhost:8000/docs    ← Swagger UI
# http://localhost:8000/redoc  ← ReDoc
# http://localhost:8000/health ← Health check
```

### 5. Run Tests

```bash
pytest tests/ -v --cov=. --cov-report=term-missing
```

---

## Staging Setup

Staging uses the same Docker Compose stack as production but with:
- Single replicas (no HA)
- HTTP-only NGINX (no SSL)
- Relaxed resource limits

```bash
cp .env.production.example .env
# Fill in staging values (use test API keys, staging DB, etc.)
nano .env

# Deploy staging stack
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Verify
curl http://staging.kisano.in/health
```

---

## Production Environment Variables Reference

All variables from `.env.production.example` — the most critical ones:

### 🔐 Security (MUST change before going live)

| Variable | Description | How to Generate |
|----------|-------------|----------------|
| `SECRET_KEY` | JWT signing key | `openssl rand -hex 32` |
| `MONGODB_URL` | MongoDB Atlas URI | From Atlas Dashboard |
| `REDIS_URL` | Redis URL with AUTH | From Redis Cloud |

### 📡 External Services

| Service | Variables | Where to Get |
|---------|-----------|-------------|
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| Razorpay | `RAZORPAY_KEY_ID`, `KEY_SECRET`, `WEBHOOK_SECRET` | [Razorpay Dashboard](https://dashboard.razorpay.com) |
| MSG91 | `MSG91_AUTH_KEY`, `SENDER_ID`, `OTP_TEMPLATE_ID` | [MSG91 Dashboard](https://msg91.com) |
| Gemini AI | `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) |
| Firebase | `FIREBASE_CREDENTIALS_JSON_PATH` | Firebase Console → Service Accounts |
| AWS S3 | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | AWS IAM Console |

---

## GitHub Secrets Setup (CI/CD)

Configure these in **GitHub → Settings → Secrets and Variables → Actions**:

### Required for CD Pipeline

| Secret Name | Value |
|-------------|-------|
| `PROD_HOST` | Production server IP address |
| `PROD_USER` | SSH username (e.g., `ubuntu`) |
| `PROD_SSH_KEY` | Contents of `~/.ssh/id_rsa` (private key) |
| `PROD_PORT` | SSH port (default: `22`) |
| `STAGING_HOST` | Staging server IP |
| `STAGING_USER` | SSH username |
| `STAGING_SSH_KEY` | Private SSH key for staging |

### Optional

| Secret Name | Value |
|-------------|-------|
| `STAGING_API_URL` | Used in frontend CD for VITE_API_URL |
| `PROD_API_URL` | Production API URL for frontend build |
| `SLACK_WEBHOOK_URL` | For deployment notifications |
| `GITLEAKS_LICENSE` | For Gitleaks secret scanning |

---

## Render.com Env Group Setup

1. Go to [Render Dashboard](https://dashboard.render.com) → **Env Groups**
2. Create a group named exactly `kisano-secrets`
3. Add all secrets listed in `.env.production.example`
4. The `render.yaml` references this group automatically

---

## Local Docker Development (Full Stack)

To run the complete stack locally (including all services):

```bash
# Start everything
docker compose up --build

# View logs
docker compose logs -f backend

# Stop everything
docker compose down

# Reset database (⚠️ destroys local data)
docker compose down -v
```
