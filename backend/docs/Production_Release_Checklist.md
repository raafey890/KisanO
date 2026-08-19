# KisanO — Production Release Checklist

**Version:** 1.0 | **Phase:** 12-Final | **Last Updated:** 2026-08-16  
**Instructions:** Complete ALL items before every production deployment.  
Check each box `[x]` as you complete it. Do NOT deploy with any `[ ]` remaining in critical sections.

---

## Release Information

| Field | Value |
|-------|-------|
| **Release Version** | v_______ |
| **Release Date** | _________ |
| **Release Engineer** | _________ |
| **Approved By** | _________ |
| **Git SHA** | _________ |
| **Staging Verified On** | _________ |

---

## 🏗️ Section 1: Infrastructure

### Domain & DNS

- [ ] `api.kisano.in` resolves to the correct server IP
  ```bash
  nslookup api.kisano.in
  ```
- [ ] DNS TTL has propagated (allow up to 24h after DNS change)
- [ ] `kisano.in` (frontend domain) resolves correctly
- [ ] No DNS record conflicts or stale CNAME entries

### HTTPS & SSL

- [ ] HTTPS redirect active (HTTP 301 to HTTPS)
  ```bash
  curl -I http://api.kisano.in/health | grep -i location
  ```
- [ ] SSL certificate is valid and not expiring within 30 days
  ```bash
  echo | openssl s_client -connect api.kisano.in:443 2>/dev/null | \
    openssl x509 -noout -enddate
  ```
- [ ] HSTS header is present
  ```bash
  curl -sI https://api.kisano.in/health | grep -i strict-transport
  ```
- [ ] TLS version is 1.2 or 1.3 (no TLS 1.0/1.1)
  ```bash
  nmap --script ssl-enum-ciphers -p 443 api.kisano.in
  ```

### NGINX

- [ ] NGINX container is running and healthy
  ```bash
  docker ps --filter "name=kisano-nginx" --format "{{.Status}}"
  ```
- [ ] NGINX config syntax is valid
  ```bash
  docker exec kisano-nginx-1 nginx -t
  ```
- [ ] Security headers present (X-Frame-Options, X-Content-Type-Options, CSP)
  ```bash
  curl -sI https://api.kisano.in/health | grep -E "X-Frame|X-Content|Content-Security"
  ```
- [ ] Rate limiting active (test with rapid requests)

---

## 🐍 Section 2: Backend

### Core Health

- [ ] Backend health endpoint returns HTTP 200
  ```bash
  curl -s https://api.kisano.in/health | python3 -m json.tool
  ```
- [ ] Health status field is `"healthy"`
  ```bash
  curl -s https://api.kisano.in/health | python3 -c \
    "import sys,json; d=json.load(sys.stdin); assert d['status']=='healthy', d"
  ```
- [ ] Swagger UI accessible at `/docs`
  ```bash
  curl -o /dev/null -s -w "%{http_code}" https://api.kisano.in/docs
  ```
- [ ] OpenAPI schema valid at `/openapi.json`
  ```bash
  curl -s https://api.kisano.in/openapi.json | python3 -m json.tool > /dev/null
  ```

### Database & Cache

- [ ] MongoDB is connected (visible in health response or logs)
  ```bash
  docker exec kisano-mongodb-1 mongosh --eval "db.adminCommand('ping')" --quiet
  ```
- [ ] Redis is connected
  ```bash
  docker exec kisano-redis-1 redis-cli ping  # Expected: PONG
  ```
- [ ] MongoDB has data (at least admin user exists)
  ```bash
  docker exec kisano-mongodb-1 mongosh kisano_production \
    --eval "db.users.countDocuments()" --quiet
  ```

### Workers & Scheduler

- [ ] Background worker container is running
  ```bash
  docker ps --filter "name=kisano-worker" --format "{{.Status}}"
  ```
- [ ] Scheduler container is running (exactly 1 instance)
  ```bash
  docker ps --filter "name=kisano-scheduler" --format "{{.Names}}" | wc -l
  ```
- [ ] No ERROR-level logs in worker/scheduler in last 5 minutes
  ```bash
  docker logs kisano-worker-1 --since 5m 2>&1 | grep -i error | wc -l
  ```

---

## 🌐 Section 3: Frontend

- [ ] Production build completes without errors (`npm run build`)
- [ ] `dist/index.html` exists and is non-empty
- [ ] Static assets (JS, CSS, images) are accessible
  ```bash
  curl -o /dev/null -s -w "%{http_code}" https://kisano.in
  ```
- [ ] `VITE_API_URL` points to production API (`https://api.kisano.in`)
- [ ] `VITE_APP_ENV=production` is set in the build
- [ ] No `console.error` or `console.warn` in browser console on load
- [ ] App loads in mobile viewport (375px width)

---

## 🔗 Section 4: Integrations

### Cloudinary (Media)

- [ ] Cloudinary credentials are using PRODUCTION keys (not test)
- [ ] Test image upload succeeds
  ```bash
  # Via API (replace TOKEN)
  curl -X POST https://api.kisano.in/api/v1/media/upload \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@/tmp/test.jpg"
  ```

### Razorpay (Payments)

- [ ] Razorpay credentials are LIVE keys (not test — prefix `rzp_live_`)
- [ ] Webhook secret is configured and matches Dashboard
- [ ] Test payment order creation succeeds (check Razorpay Dashboard)
- [ ] Webhook endpoint is reachable from Razorpay

### MSG91 (OTP / SMS)

- [ ] MSG91 Auth Key is production key
- [ ] Sender ID is approved by MSG91
- [ ] OTP template is approved and active
- [ ] Test OTP delivery succeeds to a real phone number

### Gemini AI

- [ ] `GEMINI_API_KEY` is a production key with appropriate quota
- [ ] AI Doctor endpoint responds correctly
  ```bash
  curl -s -X POST https://api.kisano.in/api/v1/ai/diagnose \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"crop": "rice", "symptoms": "yellowing leaves"}' | python3 -m json.tool
  ```

---

## 🔐 Section 5: Security

- [ ] `SECRET_KEY` is set to a 64-character hex value (not example value)
  ```bash
  # Verify it's not a placeholder
  grep SECRET_KEY .env | grep -v "REPLACE_WITH\|example\|generate" | wc -c
  ```
- [ ] GitHub Secrets are configured for all 6 CD pipeline secrets
  - `PROD_HOST`, `PROD_USER`, `PROD_SSH_KEY`
  - `STAGING_HOST`, `STAGING_USER`, `STAGING_SSH_KEY`
- [ ] Secret rotation documentation reviewed and team is trained
- [ ] `.env` file is NOT tracked in git
  ```bash
  git status .env  # Should show "nothing to commit" or not appear
  ```
- [ ] `.env_backups/` has at least one entry (from previous rotation test)
- [ ] Backup was verified (test restore succeeded in staging)
  ```bash
  ls -lh /opt/kisano/backups/ | head -5
  ```
- [ ] Restore was tested in staging (not just backup creation)

---

## 📊 Section 6: Operations

### Monitoring

- [ ] Prometheus is running and scraping the backend
  ```bash
  curl -s http://localhost:9090/api/v1/targets | python3 -c \
    "import sys,json; t=json.load(sys.stdin)['data']['activeTargets']; \
     print([x['labels']['job']+': '+x['health'] for x in t])"
  ```
- [ ] Grafana is accessible at configured URL
- [ ] At least the Node Exporter Full dashboard is imported
- [ ] At least one alert rule is configured (High Error Rate or Service Down)

### Logging

- [ ] Backend logs are in JSON format
  ```bash
  docker logs kisano-backend-1 --tail=5 2>&1 | python3 -m json.tool > /dev/null
  ```
- [ ] NGINX access logs are in JSON format
  ```bash
  docker exec kisano-nginx-1 tail -1 /var/log/nginx/access.log | python3 -m json.tool
  ```

### Health Checks

- [ ] Full post-deployment validation suite passes
  ```bash
  bash scripts/health_check.sh https://api.kisano.in
  ```
- [ ] All containers report `healthy` in `docker compose ps`

### Rollback Readiness

- [ ] Rollback procedure was tested in staging at least once
- [ ] `/tmp/kisano_rollback_production.tag` file exists with a valid image tag
- [ ] `scripts/rollback.sh` runs without errors in dry-run (staging)
- [ ] Previous image is still available in GHCR

### Backup

- [ ] Latest backup exists and is < 25 hours old
  ```bash
  find /opt/kisano/backups -name "*.archive.gz" -mtime -1 | wc -l
  ```
- [ ] Backup cron is configured
  ```bash
  crontab -l | grep backup_db
  ```
- [ ] S3 backup upload succeeded (check last backup log)

---

## 💼 Section 7: Business Verification

> Run these checks using the **actual production app** after deployment.

### Authentication

- [ ] Admin user can log in via admin panel or API
  ```bash
  curl -X POST https://api.kisano.in/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"phone": "<admin_phone>", "password": "<password>"}'
  ```
- [ ] Farmer registration flow works end-to-end
  1. Enter phone number → OTP sent via MSG91
  2. Enter OTP → account created
  3. Profile setup completes

### OTP Flow

- [ ] OTP is delivered within 30 seconds (MSG91)
- [ ] OTP expires after 10 minutes (invalid OTP rejected)
- [ ] Wrong OTP shows correct error message

### Payment Flow

- [ ] Marketplace: add item to cart → checkout → Razorpay order created
- [ ] Razorpay payment modal opens correctly
- [ ] Test payment (₹1 via Razorpay test mode) is captured correctly
- [ ] Order status updates after payment

### AI Doctor

- [ ] AI diagnosis request returns a valid structured response
- [ ] Response includes treatment recommendations
- [ ] Error handling works for unsupported crops

---

## 📋 Final Sign-Off

| Signatory | Role | Date | Signature |
|-----------|------|------|-----------|
| _________ | Release Engineer | ____ | _________ |
| _________ | Engineering Lead | ____ | _________ |
| _________ | QA / Product | ____ | _________ |

**Release approved for production:** ☐ YES  ☐ NO (list blockers below)

**Blockers (if any):**

```
1. 
2. 
3. 
```

---

*Generated by Phase 12 — KisanO Backend Production Infrastructure*
