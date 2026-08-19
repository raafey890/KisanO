# KisanO — Monitoring Guide

**Version:** 2.0 | **Last Updated:** 2026-08-16

---

## Architecture

```
Application Metrics → [Prometheus] → [Grafana Dashboards]
System Metrics     → [Node Exporter] → [Prometheus]
MongoDB Metrics    → [MongoDB Exporter] → [Prometheus]
Redis Metrics      → [Redis Exporter] → [Prometheus]
App Logs           → [JSON stdout] → [Loki / ELK]
NGINX Logs         → [JSON access log] → [Loki / ELK]
```

---

## Starting the Monitoring Stack

```bash
cd /opt/kisano/backend

# Start Prometheus + Grafana + all exporters
docker compose -f monitoring/docker-compose.monitoring.yml up -d

# Verify all services are healthy
docker compose -f monitoring/docker-compose.monitoring.yml ps
```

**Access URLs:**

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://server-ip:3000 | admin / set `GRAFANA_ADMIN_PASSWORD` |
| Prometheus | http://server-ip:9090 | No auth (restrict access!) |

> **Security:** Grafana and Prometheus ports should NOT be public. Use SSH tunnel or NGINX reverse proxy with authentication.

SSH tunnel example:
```bash
ssh -L 3000:localhost:3000 -L 9090:localhost:9090 user@api.kisano.in
# Then open http://localhost:3000 locally
```

---

## Key Metrics to Watch

### Application Health

| Metric | Prometheus Query | Alert Threshold |
|--------|-----------------|-----------------|
| Request rate | `rate(http_requests_total[5m])` | < 0 req/s for > 5 min |
| Error rate | `rate(http_requests_total{status=~"5.."}[5m])` | > 1% of requests |
| P99 latency | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` | > 2s |
| Health check | `up{job="kisano_backend"}` | = 0 (down) |

### Database

| Metric | Alert |
|--------|-------|
| MongoDB connections | > 80% of `maxConnections` |
| MongoDB operation latency | > 100ms average |
| Redis memory usage | > 80% of `maxmemory` |
| Redis rejected connections | > 0 |

### System

| Metric | Alert |
|--------|-------|
| CPU usage | > 85% for > 5 min |
| Memory usage | > 90% |
| Disk usage | > 80% |
| Disk I/O wait | > 20% |

---

## FastAPI Metrics Integration

The backend uses `prometheus-fastapi-instrumentator` for automatic metric exposure.

**Verify metrics endpoint:**
```bash
curl http://localhost:8000/metrics
# Should return Prometheus text format with:
# - http_requests_total
# - http_request_duration_seconds
# - http_request_size_bytes
# - http_response_size_bytes
```

**Adding custom metrics** (example):
```python
from prometheus_client import Counter, Histogram

ORDER_COUNTER = Counter(
    "kisano_orders_total",
    "Total orders placed",
    ["status", "payment_method"]
)

# In your order service:
ORDER_COUNTER.labels(status="placed", payment_method="upi").inc()
```

---

## Grafana Dashboard Setup

### Import Pre-built Dashboards

1. Open Grafana → **Dashboards** → **Import**
2. Import these dashboard IDs from grafana.com:

| Dashboard | ID | Use For |
|-----------|----|---------|
| FastAPI Observability | `17175` | API metrics |
| MongoDB | `7353` | MongoDB metrics |
| Redis | `11835` | Redis metrics |
| Node Exporter Full | `1860` | System metrics |

### Create Alerts

In Grafana → **Alerting** → **Alert Rules**:

1. **High Error Rate:**
   - Query: `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01`
   - Condition: > 0.01 for 5 minutes
   - Notify: Email / Slack channel

2. **Service Down:**
   - Query: `up{job="kisano_backend"} == 0`
   - Condition: == 0 for 1 minute

---

## Log Aggregation (Loki)

The backend emits structured JSON logs to stdout — compatible with Grafana Loki.

### Add Loki to the Monitoring Stack

```yaml
# Add to monitoring/docker-compose.monitoring.yml:
loki:
  image: grafana/loki:3.0.0
  ports:
    - "3100:3100"
  volumes:
    - loki_data:/loki

promtail:
  image: grafana/promtail:3.0.0
  volumes:
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
    - ./monitoring/promtail-config.yml:/etc/promtail/config.yml:ro
```

### Add Loki Data Source in Grafana

1. Grafana → **Data Sources** → **Add data source** → **Loki**
2. URL: `http://loki:3100`
3. Save & Test

### Query Logs in Grafana

```logql
# All backend errors
{container="kisano-backend"} | json | level="ERROR"

# Requests over 1 second
{container="kisano-backend"} | json | duration_ms > 1000

# Failed auth attempts
{container="kisano-backend"} | json | path=~"/api/v1/auth/.*" | status_code=~"4.."
```

---

## Backup Monitoring

Verify daily backup success:

```bash
# Check backup log
tail -50 /var/log/kisano-backup.log

# Check latest backup exists and is recent
ls -lht /opt/kisano/backups/ | head -3
find /opt/kisano/backups -name "*.archive.gz" -mtime -1 | \
  wc -l | xargs -I{} sh -c '[ {} -ge 1 ] && echo "✓ Backup exists" || echo "✗ No recent backup!"'

# Verify S3 upload
aws s3 ls s3://kisano-prod-backups/db/ --recursive | tail -3
```

---

## Alertmanager (Advanced)

For PagerDuty/Slack alerting, add to `prometheus.yml`:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - /etc/prometheus/rules/*.yml
```

Example alert rule (`monitoring/rules/backend.yml`):
```yaml
groups:
  - name: kisano_backend
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on KisanO Backend"
```
