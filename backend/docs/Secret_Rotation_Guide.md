# KisanO — Enterprise Secret Rotation Guide

**Version:** 1.0 | **Phase:** 12-Final | **Last Updated:** 2026-08-16  
**Security:** All rotation procedures require zero application code changes.

---

## Overview

This guide covers the rotation procedure for all secrets in the KisanO production system. Secrets should be rotated:

- **Routinely:** Every 90 days for all secrets
- **Immediately:** After any suspected compromise, team member departure, or security incident
- **Post-incident:** As part of the post-mortem action plan

> **Principle:** Secret rotation uses `scripts/rotate_secret.sh` which handles backup → update → restart → health check → auto-rollback automatically.

---

## Automated Rotation Tool

```bash
# Usage:
bash scripts/rotate_secret.sh <SECRET_NAME> <NEW_VALUE> [environment]

# The script:
# 1. Backs up .env with timestamp
# 2. Rotates the value atomically
# 3. Restarts only the affected services
# 4. Validates health — rolls back automatically on failure
# 5. Never logs the secret value
```

---

## Secret Inventory & Rotation Procedures

### 1. JWT Secret Key (`SECRET_KEY`)

**Impact:** All active user sessions will be invalidated (users must log in again).  
**Services restarted:** `backend`, `worker`  
**Recommended frequency:** Every 90 days

```bash
# Generate a new cryptographically secure key
NEW_KEY=$(openssl rand -hex 32)
echo "New key generated (copy to GitHub Secrets too): $NEW_KEY"

# Rotate on VPS
bash scripts/rotate_secret.sh SECRET_KEY "$NEW_KEY" production

# Update GitHub Secret:
# GitHub → Settings → Secrets → Actions → Update PROD_SECRET_KEY
# (or re-deploy via CD pipeline which injects from GitHub Secrets)

# Update Render.com:
# Dashboard → Env Groups → kisano-secrets → SECRET_KEY → Update
```

> ⚠️ **User impact:** All logged-in users will be signed out. Schedule during low-traffic window (02:00–04:00 IST).

---

### 2. MongoDB Credentials (`MONGODB_URL`)

**Impact:** Full application downtime if credentials are wrong. Test in staging first.  
**Services restarted:** `backend`, `worker`, `scheduler`  
**Recommended frequency:** Every 180 days (or immediately if compromised)

```bash
# Step 1: Create new MongoDB user (do NOT delete old one yet)
# MongoDB Atlas: Database Access → Add New Database User
# New user: kisano_app_v2 / <generated_password>

# Step 2: Test connection with new credentials
mongosh "mongodb+srv://kisano_app_v2:<newpass>@cluster.mongodb.net/kisano_production"

# Step 3: Rotate the URL
NEW_URL="mongodb+srv://kisano_app_v2:<newpass>@cluster.mongodb.net/?retryWrites=true&w=majority"
bash scripts/rotate_secret.sh MONGODB_URL "$NEW_URL" production

# Step 4: Verify application health
curl https://api.kisano.in/health

# Step 5: Delete old MongoDB user (after 30 minutes of stability)
# MongoDB Atlas: Database Access → Delete old user
```

---

### 3. Redis Password (`REDIS_URL`)

**Impact:** Background jobs pause briefly during restart. Sessions may be lost if Redis is ephemeral.  
**Services restarted:** `backend`, `worker`, `scheduler`

```bash
# Step 1: Generate new password
NEW_REDIS_PASS=$(openssl rand -hex 24)

# Step 2: Update Redis config (requirepass)
docker exec kisano-redis-1 redis-cli CONFIG SET requirepass "$NEW_REDIS_PASS"

# Step 3: Rotate in .env
NEW_REDIS_URL="redis://:${NEW_REDIS_PASS}@redis:6379/0"
bash scripts/rotate_secret.sh REDIS_URL "$NEW_REDIS_URL" production

# Step 4: Also update redis-exporter in monitoring stack
docker compose -f monitoring/docker-compose.monitoring.yml \
    up -d redis-exporter --no-deps
```

---

### 4. Cloudinary Credentials

**Impact:** Media uploads and URL generation will fail temporarily.  
**Services restarted:** `backend`

```bash
# Step 1: Generate new API key in Cloudinary Dashboard
# Settings → Access Keys → Generate New Key

# Step 2: Rotate (do each separately)
bash scripts/rotate_secret.sh CLOUDINARY_API_KEY "<new_key>" production
bash scripts/rotate_secret.sh CLOUDINARY_API_SECRET "<new_secret>" production

# Note: CLOUDINARY_CLOUD_NAME never changes (it's your account name)
```

---

### 5. Razorpay Credentials

**Impact:** Payment processing will fail temporarily. NEVER rotate during peak business hours.  
**Services restarted:** `backend`  
**⚠️ High-impact rotation — coordinate with business team**

```bash
# Step 1: Generate new API keys in Razorpay Dashboard
# Settings → API Keys → Regenerate Test Key → then Regenerate Live Key

# Step 2: Rotate LIVE keys
bash scripts/rotate_secret.sh RAZORPAY_KEY_ID "rzp_live_<new_id>" production
bash scripts/rotate_secret.sh RAZORPAY_KEY_SECRET "<new_secret>" production

# Step 3: Update webhook secret
# Razorpay Dashboard → Webhooks → Regenerate Secret
bash scripts/rotate_secret.sh RAZORPAY_WEBHOOK_SECRET "<new_webhook_secret>" production

# Step 4: Verify with a test transaction
```

---

### 6. MSG91 Credentials (`MSG91_AUTH_KEY`)

**Impact:** OTP delivery will fail temporarily.  
**Services restarted:** `backend`

```bash
# Step 1: Generate new auth key in MSG91 Dashboard
# API Credentials → Generate New Auth Key

# Step 2: Rotate
bash scripts/rotate_secret.sh MSG91_AUTH_KEY "<new_auth_key>" production

# Step 3: Verify OTP delivery in staging
```

---

### 7. Gemini API Key (`GEMINI_API_KEY`)

**Impact:** AI Doctor feature unavailable temporarily.  
**Services restarted:** `backend`

```bash
# Step 1: Generate new key in Google AI Studio
# https://aistudio.google.com → API Keys → Create API Key

# Step 2: Rotate
bash scripts/rotate_secret.sh GEMINI_API_KEY "<new_api_key>" production

# Step 3: Verify AI feature
curl -H "Authorization: Bearer <user_token>" https://api.kisano.in/api/v1/ai/health
```

---

### 8. SSL Certificates (Let's Encrypt)

**Impact:** None — Certbot renews 30 days before expiry automatically.  
**Auto-rotation:** Yes, via Certbot container + cron

```bash
# Check certificate expiry
docker exec kisano-nginx-1 \
    openssl x509 -in /etc/letsencrypt/live/api.kisano.in/fullchain.pem \
    -noout -enddate

# Force manual renewal (if needed)
docker exec kisano-certbot-1 certbot renew --force-renewal

# Reload NGINX after manual renewal
docker exec kisano-nginx-1 nginx -s reload

# Verify renewal
curl -I https://api.kisano.in/health | grep -i "strict-transport"
```

---

### 9. Firebase Service Account (FCM)

**Impact:** Push notifications unavailable temporarily.

```bash
# Step 1: Create new service account key in Firebase Console
# Project Settings → Service Accounts → Generate New Private Key
# Download: firebase-service-account-new.json

# Step 2: Copy to server
scp firebase-service-account-new.json user@api.kisano.in:/secrets/

# Step 3: Update path in .env (if filename changed) or just replace the file
cp /secrets/firebase-service-account-new.json /secrets/firebase-service-account.json

# Step 4: Restart backend (reads file on startup)
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart backend

# Step 5: Delete old service account key from Firebase Console
```

---

## Rotation Schedule

| Secret | Frequency | Impact | Best Window |
|--------|-----------|--------|-------------|
| `SECRET_KEY` | Every 90 days | Users sign out | 02:00–04:00 IST |
| `MONGODB_URL` | Every 180 days | Brief downtime possible | 02:00–04:00 IST |
| `REDIS_URL` | Every 180 days | Job pause only | Any low-traffic |
| `CLOUDINARY_*` | Every 180 days | Upload pause | Any low-traffic |
| `RAZORPAY_*` | Every 180 days | Payment pause | Non-business hours |
| `MSG91_AUTH_KEY` | Every 90 days | OTP pause | 02:00–04:00 IST |
| `GEMINI_API_KEY` | Every 90 days | AI feature pause | Any low-traffic |
| SSL Certificate | Automatic (30-day) | None | Automated |
| Firebase SA Key | Every 180 days | Push pause | Any low-traffic |

---

## Post-Rotation Checklist

After every rotation:

- [ ] Health check passes: `curl https://api.kisano.in/health`
- [ ] Feature specific to rotated secret works (test manually)
- [ ] GitHub Secret updated (for CI/CD re-deploys)
- [ ] Render Env Group updated (if using Render)
- [ ] Rotation logged in team security log
- [ ] Old credential revoked at provider dashboard
- [ ] `.env_backups/` cleaned up (keep last 3 only)

---

## Emergency Rotation (Credential Compromise)

If a credential is suspected compromised:

```bash
# 1. Immediately revoke at provider (Cloudinary/Razorpay/etc dashboard)
# 2. Generate new credential at provider
# 3. Rotate immediately (no maintenance window needed)
bash scripts/rotate_secret.sh <SECRET_NAME> "<new_value>" production
# 4. Review access logs for suspicious activity
docker compose logs backend --since 24h | grep -i "error\|unauthorized\|403\|401"
# 5. Notify team immediately
# 6. File incident report
```
