# KisanO — Load Testing Readiness Guide

**Version:** 1.0 | **Phase:** 12-Final | **Last Updated:** 2026-08-16  
**Status:** Architecture-Ready — Tests not yet executed

---

## Overview

This guide documents the load testing targets, tooling, test scenarios, and resource monitoring strategy for KisanO Backend. Load tests should be run against the **staging environment** before each major release and before expected traffic spikes (e.g., promotional campaigns).

---

## 1. Performance Targets

### Concurrent Users

| Scenario | Target Concurrent Users | Notes |
|----------|------------------------|-------|
| Normal load | 100 concurrent | Typical daily operation |
| Peak load | 500 concurrent | Market day / campaign spikes |
| Stress test | 1000 concurrent | Maximum before graceful degradation |
| Spike test | 0 → 500 in 30s | Simulates viral traffic burst |

### API Throughput Targets

| Endpoint Category | Target RPS | P50 Latency | P99 Latency |
|-------------------|-----------|-------------|-------------|
| `GET /health` | Unlimited | < 10ms | < 50ms |
| `GET /api/v1/*` (reads) | 500 RPS | < 200ms | < 800ms |
| `POST /api/v1/auth/login` | 50 RPS | < 300ms | < 1s |
| `POST /api/v1/orders` | 100 RPS | < 500ms | < 2s |
| `POST /api/v1/payments/*` | 50 RPS | < 1s | < 3s |
| `POST /api/v1/ai/diagnose` | 20 RPS | < 3s | < 10s |
| `GET /api/v1/marketplace` | 300 RPS | < 300ms | < 1s |

### Error Rate Target

| Condition | Maximum Error Rate |
|-----------|-------------------|
| Normal load (100 users) | < 0.1% |
| Peak load (500 users) | < 1% |
| Stress test (1000 users) | < 5% (graceful degradation) |

---

## 2. Load Testing Tools

### Recommended: k6 (Primary)

```bash
# Install k6
brew install k6                  # macOS
sudo apt-get install k6          # Ubuntu
# Or via Docker:
docker run --rm -i grafana/k6 run - < tests/load/k6_smoke.js
```

**k6 is recommended** because:
- Scripted in JavaScript (familiar for the team)
- Native Prometheus/Grafana output
- Supports all test types (smoke, load, stress, spike)
- Low resource overhead on the test runner

### Alternative: Locust (Python-based)

```bash
# Install
pip install locust

# Run
locust -f tests/load/locustfile.py --host=https://staging.kisano.in

# Web UI at: http://localhost:8089
```

**Locust is useful** when:
- Testing complex, stateful user flows (login → browse → order)
- Real-time visual monitoring is needed
- Python developers prefer scripting over JS

---

## 3. Test Scenarios

### Scenario 1: Smoke Test (Baseline)

**Purpose:** Verify no regressions; system handles minimal load  
**Duration:** 2 minutes  
**Users:** 5 concurrent

```javascript
// tests/load/k6_smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // <1% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://staging.kisano.in';

export default function () {
  // Health check
  let health = http.get(`${BASE_URL}/health`);
  check(health, { 'health: status 200': (r) => r.status === 200 });

  // Marketplace listing
  let marketplace = http.get(`${BASE_URL}/api/v1/marketplace/products?page=1&limit=20`);
  check(marketplace, { 'marketplace: status 200': (r) => r.status === 200 });

  sleep(1);
}
```

---

### Scenario 2: Average Load Test

**Purpose:** Verify system handles typical daily traffic  
**Duration:** 10 minutes  
**Users:** 100 concurrent (ramp up over 2 minutes)

```javascript
// tests/load/k6_load.js
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '6m', target: 100 },   // Stay at 100
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<800'],  // 99% under 800ms
    http_req_failed: ['rate<0.01'],
  },
};
```

---

### Scenario 3: Peak / Stress Test

**Purpose:** Validate system behaviour at maximum expected load  
**Duration:** 15 minutes  
**Users:** Ramp to 500

```javascript
// tests/load/k6_stress.js
export const options = {
  stages: [
    { duration: '3m', target: 100 },   // Warm up
    { duration: '3m', target: 300 },   // Ramp to 300
    { duration: '3m', target: 500 },   // Ramp to 500 (peak)
    { duration: '3m', target: 500 },   // Sustain peak
    { duration: '3m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% under 2s at peak
    http_req_failed: ['rate<0.05'],    // <5% errors acceptable at stress
  },
};
```

---

### Scenario 4: Spike Test

**Purpose:** Simulate viral burst (sudden campaign/media attention)  
**Duration:** 5 minutes

```javascript
// tests/load/k6_spike.js
export const options = {
  stages: [
    { duration: '10s', target: 0 },
    { duration: '30s', target: 500 },  // Spike to 500 in 30 seconds
    { duration: '3m',  target: 500 },  // Sustain spike
    { duration: '1m',  target: 0 },    // Drop back
  ],
};
```

---

### Scenario 5: Authenticated User Flow (Locust)

**Purpose:** Test realistic user journey (login → browse → add to cart → order)

```python
# tests/load/locustfile.py
from locust import HttpUser, task, between, SequentialTaskSet

class FarmerJourney(SequentialTaskSet):
    token = None

    @task
    def login(self):
        resp = self.client.post("/api/v1/auth/login", json={
            "phone": "9876543210",
            "otp": "000000"          # Use test OTP in staging
        })
        if resp.status_code == 200:
            self.token = resp.json()["access_token"]

    @task
    def browse_marketplace(self):
        self.client.get(
            "/api/v1/marketplace/products",
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task
    def view_product(self):
        self.client.get(
            "/api/v1/marketplace/products/PROD001",
            headers={"Authorization": f"Bearer {self.token}"}
        )

class KisanOLoadTest(HttpUser):
    tasks = [FarmerJourney]
    wait_time = between(1, 3)
    host = "https://staging.kisano.in"
```

---

## 4. Running Load Tests

```bash
# Smoke test (run before every release)
k6 run --env BASE_URL=https://staging.kisano.in tests/load/k6_smoke.js

# Load test (run weekly on staging)
k6 run --env BASE_URL=https://staging.kisano.in tests/load/k6_load.js

# With Prometheus output (view in Grafana)
k6 run --out prometheus=http://prometheus:9090/api/v1/write \
    tests/load/k6_load.js

# Locust (web UI)
locust -f tests/load/locustfile.py \
    --host=https://staging.kisano.in \
    --users=100 --spawn-rate=10
```

---

## 5. Resource Monitoring Strategy During Load Tests

Monitor these metrics in **Grafana** while tests run:

### Application Layer

| Metric | Grafana Query | Alert If |
|--------|--------------|----------|
| Request rate | `rate(http_requests_total[1m])` | — |
| P99 latency | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[1m]))` | > 2s |
| Error rate | `rate(http_requests_total{status=~"5.."}[1m]) / rate(http_requests_total[1m])` | > 5% |
| Active connections | `nginx_connections_active` | — |

### Database Layer

| Metric | Alert If |
|--------|---------|
| MongoDB active connections | > 80% of limit |
| MongoDB operation latency | > 100ms |
| Redis used memory | > 80% of `maxmemory` |
| Redis command latency | > 1ms |

### System Layer

| Metric | Alert If |
|--------|---------|
| CPU usage | > 85% sustained |
| Memory usage | > 90% |
| Disk I/O wait | > 20% |
| Network bandwidth | Approaching provider limit |

### Scaling Decision Thresholds

| Observation | Action |
|-------------|--------|
| CPU > 80% at 300 users | Add another `backend` replica |
| Memory > 80% at 300 users | Increase container memory limit |
| MongoDB latency > 50ms | Add MongoDB read replica or index |
| Redis latency > 1ms | Check Redis memory/eviction |
| P99 > 1s at 100 users | Profile slow endpoints with `py-spy` |

---

## 6. Load Test Pre-Conditions

Before running load tests, ensure:

- [ ] Tests run against **staging**, never production
- [ ] Staging has production-equivalent infrastructure (same compose config)
- [ ] Test MongoDB has realistic data volume (use `scripts/seed_db.py`)
- [ ] Rate limiting is **disabled or raised** in staging for load tests
- [ ] Monitoring stack is running: `docker compose -f monitoring/docker-compose.monitoring.yml up -d`
- [ ] Grafana dashboards are open and watching during the test
- [ ] Test results are saved: `k6 run ... | tee results/load_$(date +%Y%m%d).txt`
