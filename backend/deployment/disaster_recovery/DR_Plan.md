# KisanO — Disaster Recovery Plan

**Version:** 2.0  
**Classification:** Internal — Operations  
**Last Updated:** 2026-08-16  
**Owner:** Engineering / DevOps

---

## 1. Objectives

| Objective | Target |
|-----------|--------|
| **RTO** (Recovery Time Objective) | < 30 minutes for most failures |
| **RPO** (Recovery Point Objective) | < 24 hours (daily backups) |
| **Backup Frequency** | Daily at 02:00 UTC |
| **Backup Retention** | 30 days local + S3 |
| **Uptime Target** | 99.5% |

---

## 2. Failure Scenario Playbooks

### Scenario 1 — Bad Code Deployment (API Crash)

**Symptoms:** `/health` returns non-200 immediately after deploy; mass 500 errors.

**Detection:** Automated post-deploy health check in CI/CD triggers; Grafana alert fires.

**Recovery Steps:**

```bash
# Option A: Automated (triggered by CD pipeline automatically)
bash scripts/rollback.sh production

# Option B: Manual
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  images --format json  # Find previous image tag

# Force restart with previous image
KISANO_BACKEND_IMAGE=<previous_tag> \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  up -d --force-recreate

# Verify health
curl https://api.kisano.in/health
```

**Expected RTO:** < 5 minutes (automated rollback).

---

### Scenario 2 — MongoDB Data Corruption / Loss

**Symptoms:** DB queries fail; corruption errors in logs; containers crash on boot.

**Recovery Steps:**

```bash
# Step 1: Stop the API to prevent further writes
docker compose -f docker-compose.yml -f docker-compose.prod.yml stop backend worker

# Step 2: Identify the last known-good backup
ls -lt /opt/kisano/backups/

# Step 3: (Optional) Download from S3 if local is unavailable
aws s3 ls s3://kisano-prod-backups/db/ --recursive | sort | tail -5
aws s3 cp s3://kisano-prod-backups/db/kisano_mongodb_YYYY-MM-DD_HH-MM-SS.archive.gz /tmp/

# Step 4: Restore
bash scripts/restore_db.sh /opt/kisano/backups/kisano_mongodb_YYYY-MM-DD.archive.gz

# Step 5: Restart services
docker compose -f docker-compose.yml -f docker-compose.prod.yml start backend worker

# Step 6: Verify
curl https://api.kisano.in/health
```

**Expected RTO:** 15–30 minutes depending on database size.

---

### Scenario 3 — Redis Cache / Queue Failure

**Symptoms:** Background jobs not processing; sessions invalidated; rate limiting down.

**Recovery Steps:**

```bash
# Restart Redis container
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart redis

# Redis data is ephemeral by design — no restore needed for cache
# Background jobs will reprocess from MongoDB state
# Verify
docker exec kisano-redis-1 redis-cli ping  # should return PONG
```

**Expected RTO:** < 2 minutes.

---

### Scenario 4 — Complete VPS / Server Failure

**Symptoms:** SSH unavailable; all services unreachable; cloud dashboard shows instance down.

**Recovery Steps:**

```bash
# On a NEW server (Ubuntu 22.04+):

# Step 1: Provision and SSH in
ssh user@new-server-ip

# Step 2: Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker

# Step 3: Clone the repository
git clone https://github.com/your-org/kisano.git /opt/kisano
cd /opt/kisano/backend

# Step 4: Restore secrets (from secure Vault or team password manager)
cp /secure-location/.env.production .env

# Step 5: Pull images and start
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Step 6: SSL — issue new certificate
bash deployment/nginx/ssl_setup.sh

# Step 7: Restore database from S3
bash scripts/restore_db.sh s3://kisano-prod-backups/db/kisano_mongodb_latest.archive.gz

# Step 8: Update DNS (Cloudflare / Route53)
# Point api.kisano.in → new server IP

# Step 9: Validate
bash scripts/health_check.sh https://api.kisano.in
```

**Expected RTO:** 30–60 minutes (limited by DNS propagation).

---

### Scenario 5 — NGINX / SSL Certificate Expiry

**Symptoms:** HTTPS fails with certificate error; users see browser warning.

**Recovery Steps:**

```bash
# Force certificate renewal
docker exec kisano-certbot-1 certbot renew --force-renewal

# Reload NGINX
docker exec kisano-nginx-1 nginx -s reload

# Verify
curl -I https://api.kisano.in/health | grep -i "strict-transport"
```

**Prevention:** Certbot container auto-renews every 12 hours. Check cron:
```bash
0 3 * * * /opt/kisano/backend/deployment/nginx/certbot-renew.sh
```

---

## 3. Backup Verification Schedule

Perform the following checks **monthly**:

| Task | Command |
|------|---------|
| Verify backup integrity | `gzip -t /opt/kisano/backups/latest.archive.gz` |
| Test restore to staging | `bash scripts/restore_db.sh <latest_backup> --force` |
| Confirm S3 replication | `aws s3 ls s3://kisano-prod-backups/db/ --recursive` |
| Test rollback procedure | `bash scripts/rollback.sh staging` |

---

## 4. Escalation Contacts

| Role | Contact | Priority |
|------|---------|----------|
| On-call Engineer | See PagerDuty / team channel | P0 — immediate |
| DevOps Lead | See team contacts | P1 — < 15 min |
| Engineering Manager | See team contacts | P2 — < 30 min |

---

## 5. Post-Incident Actions

After any incident recovery:

1. Write a brief post-mortem (use `docs/runbooks/` template)
2. Identify the root cause
3. Add preventive measures to CI/CD or monitoring
4. Update this DR Plan if procedures changed
