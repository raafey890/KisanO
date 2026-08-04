# Production Readiness Checklist

Before pushing a major release of the KisanO Backend to the Production environment, the DevOps and Lead Engineering team must verify all items on this checklist.

## 1. Security & Secrets
- [ ] Ensure `EnvironmentSecretProvider` is properly configured with Production values.
- [ ] Ensure **JWT Secret Keys** have been rotated if older than 90 days.
- [ ] Verify `SecurityHeadersMiddleware` is active and injecting strict HSTS and CSP policies.
- [ ] Ensure all mock API keys are disabled in production.

## 2. Monitoring & Logging
- [ ] Ensure `ObservabilityMiddleware` is active and streaming traces.
- [ ] Verify DataDog / Prometheus metrics dashboard is receiving active heartbeats.
- [ ] Check `security_audit` MongoDB collection is successfully capturing authentication failures.

## 3. Database & Caching
- [ ] Ensure MongoDB `authSource` is correctly configured with strong production credentials.
- [ ] Verify `CacheEngine` successfully connects to the persistent Redis L2 cluster (not falling back to InMemory L1).
- [ ] Run `pytest --cov=modules` and ensure coverage is >80%.

## 4. Operational Readiness
- [ ] Verify the `backup.sh` script ran successfully last night and pushed to S3.
- [ ] Ensure the latest `deploy.sh` script executes the rolling update correctly on the Staging environment.
- [ ] Verify the Gateway `PolicyEngine` can successfully toggle Maintenance Mode.

## Sign-off
**Date:** ___________  
**DevOps Lead:** ___________  
**Architecture Lead:** ___________
