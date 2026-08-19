# KisanO — Rollback Guide

**Version:** 2.0 | **Last Updated:** 2026-08-16  
**Use when:** A deployment caused instability and you need to revert quickly.

---

## Decision Tree

```
POST-DEPLOYMENT ISSUE DETECTED
          │
          ├── Health check failed automatically?
          │         └── YES → Rollback was triggered automatically by CD pipeline ✓
          │
          └── Issue discovered manually?
                    │
                    ├── API crashes / 500 errors → Scenario A: Code Rollback
                    ├── Data corruption → Scenario B: Database Restore
                    └── Both → Scenario B first, then A
```

---

## Scenario A: Code Rollback (Bad Deployment)

### Automatic (CD pipeline triggers this on health check failure)

The CD pipeline automatically calls `scripts/rollback.sh` when health validation fails.
No manual action needed — monitor the GitHub Actions log.

### Manual Rollback

```bash
# SSH into the production server
ssh user@api.kisano.in

cd /opt/kisano/backend

# Option 1: Use the rollback script (uses saved rollback reference)
bash scripts/rollback.sh production

# Option 2: Manual — list available images and restore
docker images | grep kisano-backend
# Pick the previous working tag (e.g., sha-abc1234)

KISANO_BACKEND_IMAGE=ghcr.io/your-org/kisano-backend:sha-abc1234 \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  up -d --force-recreate backend

# Option 3: Emergency — revert to the last git tag
git log --oneline -10
git checkout v1.2.3  # Last known stable tag
bash scripts/deploy.sh production
```

### Verify Rollback

```bash
bash scripts/health_check.sh https://api.kisano.in

# Check which image is running
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  images backend

# Check logs for stability
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  logs --tail=100 backend
```

**Expected time:** < 5 minutes.

---

## Scenario B: Database Rollback (Data Corruption)

> ⚠️ **This drops and replaces the production database. Proceed carefully.**

```bash
# Step 1: Stop the API to freeze the state
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  stop backend worker

# Step 2: List available backups (most recent first)
ls -lt /opt/kisano/backups/ | head -10

# Step 3: Verify backup integrity before restoring
BACKUP=/opt/kisano/backups/kisano_mongodb_YYYY-MM-DD_HH-MM-SS.archive.gz
gzip -t "$BACKUP" && echo "✓ Archive is valid" || echo "✗ Archive is corrupt"

# Step 4: Restore (with confirmation prompt)
bash scripts/restore_db.sh "$BACKUP"

# Step 5: Restart services
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  start backend worker

# Step 6: Validate
bash scripts/health_check.sh https://api.kisano.in
```

**Expected time:** 15–30 minutes (depends on DB size).

---

## Scenario C: Render.com Rollback

1. Go to **Render Dashboard** → Select the `kisano-backend` service
2. Click **Deploys** → Find the last successful deploy
3. Click **Redeploy** on that version
4. Render will redeploy from the previous Docker image with zero-downtime

---

## Post-Rollback Checklist

After any rollback, complete the following before the next deploy:

- [ ] Confirm health check passes: `curl https://api.kisano.in/health`  
- [ ] Review the failed deployment logs in GitHub Actions or `docker logs`  
- [ ] Identify root cause (code bug, config issue, dependency change)  
- [ ] Create a fix branch, not a direct push to `main`  
- [ ] Test the fix in **staging** before re-deploying to production  
- [ ] Notify the team in the engineering channel  
- [ ] Write a brief post-mortem in `docs/runbooks/`  

---

## Emergency Contacts

If automated rollback fails and the service remains down, escalate immediately using the contacts in [DR_Plan.md](../deployment/disaster_recovery/DR_Plan.md).
