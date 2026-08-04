# Security Policy

## Supported Versions
Only the current major version (`v1.x.x`) receives critical security patches.

## Reporting a Vulnerability

The KisanO Platform is built on a strict **Zero-Trust Architecture**. If you bypass the `SecurityEngine`, manage to execute a Replay Attack against our Webhooks, or bypass the `RateLimiter`, we want to know immediately.

1. **DO NOT open a public GitHub issue.**
2. Email your findings to `security@kisano.com`.
3. We will acknowledge receipt within 24 hours and aim to patch critical Zero-Days within 48 hours.

## Audits
All API access is immutable and logged via our `SecurityAuditEngine` to the `security_audit` MongoDB collection.
