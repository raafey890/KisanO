# KisanO Enterprise Deployment Guide

This guide covers everything required to deploy KisanO Version 1.0 to a production environment.

## 1. Hosting Architecture
KisanO is optimized for **VPS Hosting** (e.g., Hetzner, DigitalOcean) using `docker-compose.prod.yml`.
- **Backend API**: FastAPI (Port 8000 internally)
- **Frontend SPA**: React (Deployed via Vercel/Netlify OR NGINX static hosting)
- **Database**: MongoDB (Local Docker or Atlas)
- **Cache/Queue**: Redis (Local Docker or Redis Cloud)
- **SSL**: Automated via Certbot & NGINX

## 2. Server Setup (Ubuntu 22.04 LTS)
1. Install Docker & Docker Compose
   ```bash
   sudo apt update && sudo apt install docker.io docker-compose-v2 git -y
   ```
2. Clone Repository
   ```bash
   git clone https://github.com/kisano/kisano.git /opt/kisano
   cd /opt/kisano
   ```
3. Environment Setup
   - Copy `.env.production.example` to `backend/.env`
   - Fill in ALL required variables (`SECRET_KEY`, APIs, DB).

## 3. Multi-Environment & Database Strategy
KisanO supports seamless database swapping via environment variables:
- **Local MongoDB**: `MONGODB_URL=mongodb://mongodb:27017/`
- **MongoDB Atlas**: `MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/kisano_prod`
- **Local Redis**: `REDIS_URL=redis://redis:6379/0`
- **Redis Cloud**: `REDIS_URL=redis://default:pass@redis-cloud-url.com:6379/0`
No code changes are required.

## 4. Cloudflare Readiness & DNS
Point the following DNS A records to your VPS IP:
- `api.kisano.in`
- `kisano.in`
- `www.kisano.in`
- `admin.kisano.in`

**Cloudflare Settings**:
- Proxy Status: **Proxied (Orange Cloud)**
- SSL/TLS encryption mode: **Full (Strict)**
- Edge Cache TTL: **2 hours**
- WAF: Enable managed rules to block SQLi and XSS. Add a Rate Limiting rule for `POST /api/v1/auth/login`.

## 5. Deployment & Rollback
To deploy manually:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
The GitHub Action (`.github/workflows/deploy.yml`) will automate this on push to `main` and execute `verify_deployment.sh`. If it fails, it automatically restores the `kisano-backend:previous` image.
