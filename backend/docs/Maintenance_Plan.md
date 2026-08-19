# KisanO Maintenance & Runbook Plan

## 1. Operational Runbooks (Common Scenarios)

### Backend Service Restart
```bash
cd /path/to/kisano/backend
docker-compose -f docker-compose.prod.yml restart api
```

### Worker/Scheduler Restart
```bash
cd /path/to/kisano/backend
docker-compose -f docker-compose.prod.yml restart worker
```

### Redis Restart (Cache Clear)
```bash
cd /path/to/kisano/backend
docker-compose -f docker-compose.prod.yml restart redis
# Note: In-memory cache will be lost. Sessions may require re-auth if stored here.
```

### MongoDB Recovery (Restore from Backup)
```bash
cd /path/to/kisano/backend
./scripts/restore_db.sh <path-to-backup-file.archive>
```

### SSL Renewal Override
```bash
cd /path/to/kisano/backend
docker-compose -f docker-compose.prod.yml exec nginx certbot renew --force-renewal
docker-compose -f docker-compose.prod.yml restart nginx
```

## 2. Vendor Failure Fallback Procedures

### Razorpay Unavailable
- **Impact:** New payments and marketplace checkouts will fail.
- **Procedure:** 
  1. Post an alert banner on the frontend indicating "Payments Temporarily Unavailable."
  2. Suspend automated payment collection cron jobs to prevent false payment failures in DB.
  3. Monitor Razorpay status page.
  4. Once restored, manually trigger the payment sync job for any hanging transactions.

### MSG91 Unavailable
- **Impact:** SMS OTPs will fail. Users cannot register or login if relying solely on SMS.
- **Procedure:**
  1. Toggle `USE_EMAIL_OTP_FALLBACK=true` in `.env` to route OTPs through the email provider (e.g., SendGrid/SES) instead.
  2. Monitor MSG91 status. Switch back when resolved.

### Cloudinary Unavailable
- **Impact:** Equipment images and AI Doctor uploads will fail.
- **Procedure:**
  1. Temporarily disable new image uploads on the frontend.
  2. Existing images (cached by CDN) will likely still serve. Wait for provider resolution.

### Gemini API Unavailable
- **Impact:** AI Doctor inference will fail.
- **Procedure:**
  1. The API should catch the 503/timeout and return a graceful localized error message: "AI Analysis is currently degraded. Please try again later."
  2. Consider queuing the analysis request for background processing when the API recovers, notifying the user via push when complete.

### MongoDB Unavailable
- **Impact:** Complete system SEV-1 outage.
- **Procedure:** 
  1. If self-hosted container failed: `docker-compose restart db`.
  2. If data corruption: Restore from latest S3 backup (see MongoDB Recovery runbook).
  3. If migrating to Managed Atlas: Update `MONGODB_URL` in `.env` and restart backend.
