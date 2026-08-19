# KisanO Post-Launch Checklist

## Day 1 (Go-Live Day)
- [ ] Monitor real-time traffic in NGINX logs and Grafana.
- [ ] Verify SSL certificates are active on the production domain.
- [ ] Verify frontend assets (JS/CSS) are caching properly (check Network tab for HTTP 304 / 200 from cache).
- [ ] Test a live end-to-end registration flow using a test user account.
- [ ] Perform a test $1 transaction via Razorpay in Live mode (and refund it).
- [ ] Send a test SMS via MSG91 in Live mode.
- [ ] Monitor background job queues for any immediate failures.

## Week 1 (Hypercare)
- [ ] Check NGINX error logs (`error.log`) daily for unexpected 500s.
- [ ] Review Prometheus/Grafana dashboards twice daily for memory/CPU spikes.
- [ ] Validate that the automated MongoDB backup successfully executes and uploads to S3 every night.
- [ ] Ensure database index usage is optimal by reviewing slow query logs (if enabled).
- [ ] Check cloud billing dashboard (Render/AWS) to ensure cost projections match reality.
- [ ] Triage any user-reported bugs within 4 hours.

## Month 1 (Transition to Steady State)
- [ ] Conduct a load review: compare actual RPS to load testing benchmarks.
- [ ] Run the secret rotation script (`rotate_secret.sh`) for the first time in production for high-risk keys (JWT secret).
- [ ] Review Error Budget burn rate. Adjust alert thresholds if necessary.
- [ ] Hold a post-launch retrospective with the engineering team.
- [ ] Archive all Go-Live checklists and lock down emergency access protocols.
