# KisanO — Web Application Firewall (WAF) Readiness Guide

**Version:** 1.0 | **Phase:** 12-Final | **Last Updated:** 2026-08-16  
**Status:** Architecture-Ready — No WAF installed yet

---

## Overview

This document describes how the KisanO deployment architecture is prepared for future WAF integration, without requiring any application code changes. The WAF sits **upstream of NGINX** and intercepts all inbound HTTP/S traffic.

---

## 1. Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────▼─────────────┐
          │    WAF Layer (future)      │
          │  Cloudflare / AWS WAF /    │
          │  Azure WAF / ModSecurity   │
          └─────────────┬─────────────┘
                        │ Filtered & inspected traffic
          ┌─────────────▼─────────────┐
          │         NGINX             │  ← SSL termination, rate limiting
          │    (api.kisano.in:443)    │    security headers, HTTP/2
          └─────────────┬─────────────┘
                        │
          ┌─────────────▼─────────────┐
          │      FastAPI Backend       │  ← Business logic
          │        :8000               │
          └─────────────┬─────────────┘
                        │
          ┌─────────────▼─────────────┐
          │    MongoDB + Redis         │
          └────────────────────────────┘
```

**No application code changes are required to insert a WAF at any point in this chain.**

---

## 2. WAF Compatibility Matrix

| WAF Product | Integration Mode | Additional Config Required | Compatible |
|-------------|-----------------|---------------------------|------------|
| **Cloudflare WAF** | DNS proxy (`api.kisano.in` → Cloudflare edge) | Set NGINX `real_ip_header CF-Connecting-IP` | ✅ |
| **AWS WAF** | ALB + WAF rules in front of server | Update `X-Forwarded-For` trust | ✅ |
| **Azure WAF** | Azure Application Gateway upstream | Update proxy headers | ✅ |
| **ModSecurity** | NGINX module (`modsecurity-nginx`) | Add to NGINX config; no app changes | ✅ |

---

## 3. Current NGINX Headers — WAF-Compatible

The NGINX config already sets these headers that WAFs use for inspection and forwarding:

```nginx
# Already configured in nginx/nginx.conf
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host $host;
```

These are the **standard headers** all WAF products expect to find on forwarded requests.

---

## 4. Per-WAF Integration Steps (When Ready)

### Option A: Cloudflare WAF (Recommended — Zero Infrastructure Change)

1. Add domain to Cloudflare, set DNS to **Proxied** mode
2. Cloudflare handles WAF rules, DDoS protection, and SSL
3. Update NGINX to trust Cloudflare IPs for real IP resolution:

```nginx
# Add to nginx.conf http block — no app changes needed
real_ip_header CF-Connecting-IP;
real_ip_recursive on;

# Cloudflare IP ranges (update periodically from https://www.cloudflare.com/ips/)
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;
```

4. In Cloudflare Dashboard: Security → WAF → Create rules

---

### Option B: AWS WAF

1. Deploy an **Application Load Balancer (ALB)** in front of the server
2. Attach **AWS WAF** to the ALB with managed rule groups:
   - `AWSManagedRulesCommonRuleSet`
   - `AWSManagedRulesSQLiRuleSet`
   - `AWSManagedRulesKnownBadInputsRuleSet`
3. Update NGINX to trust ALB source IPs:
```nginx
# Add ALB IP ranges to trusted proxies
set_real_ip_from 10.0.0.0/8;   # VPC internal range
real_ip_header X-Forwarded-For;
```
4. No application code changes needed.

---

### Option C: ModSecurity (NGINX Module)

1. Install `libmodsecurity3` and `nginx-module-modsecurity`:
```bash
sudo apt-get install -y libmodsecurity3
# Or build from source for nginx:alpine
```

2. Add to `nginx.conf` (no app changes):
```nginx
# In http block
modsecurity on;
modsecurity_rules_file /etc/nginx/modsecurity/modsecurity.conf;

# Load OWASP Core Rule Set
include /etc/nginx/modsecurity/crs-setup.conf;
include /etc/nginx/modsecurity/rules/*.conf;
```

3. Docker image update needed for NGINX (add ModSecurity build step).
4. No FastAPI or business logic changes needed.

---

## 5. WAF Rule Recommendations (When Deployed)

Regardless of WAF product, enable these rule categories:

| Rule Category | Purpose | Action |
|---------------|---------|--------|
| SQLi (SQL Injection) | Protect MongoDB query inputs | Block |
| XSS (Cross-Site Scripting) | Protect response rendering | Block |
| OWASP Top 10 | General web attack patterns | Block |
| Rate limiting | Complement NGINX rate limiting | Challenge/Block |
| Bot protection | Block scrapers, credential stuffing | Challenge |
| Geo-blocking | Block non-target geographies (optional) | Block |
| Known bad IPs | Threat intelligence IP block lists | Block |

---

## 6. Application-Side WAF Compatibility Checklist

The following have already been verified as WAF-compatible:

- [x] All API inputs are validated via **Pydantic** (field types, length limits)
- [x] MongoDB queries use **parameterized ODM** (Motor/Beanie) — no raw query injection
- [x] Authentication uses **JWT** — not cookie-based (no CSRF surface)
- [x] File uploads go through **Cloudinary** — no server-side file storage
- [x] All error responses return **structured JSON** — WAF can inspect response bodies
- [x] Rate limiting at NGINX — WAF rate limiting is purely additive
- [x] CORS configured at FastAPI — WAF CORS interception does not conflict

---

## 7. Production Recommendation

> **Recommended for go-live:** Enable **Cloudflare WAF (Free tier)** as an immediate,  
> zero-cost WAF layer. It requires only a DNS change and 2 lines of NGINX config.  
> No application changes, no additional infrastructure.

Steps to enable today:
1. Point `api.kisano.in` DNS to Cloudflare (Proxied)
2. Add Cloudflare IP trust block to `nginx.conf`
3. Enable Cloudflare WAF in Dashboard → Security → WAF
4. Done.
