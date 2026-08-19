# KisanO Operations Manual

## 1. Service Level Objectives (SLOs)
Measurable production objectives the system must meet to ensure business reliability:
- **API Availability:** 99.9% uptime (max 43m downtime/month).
- **Maximum API Latency:** P95 < 500ms, P99 < 800ms.
- **Worker Processing Time:** Background jobs (e.g., emails/notifications) processed within 2 minutes.
- **Notification Delivery Success Rate:** 99.5% success rate for SMS (MSG91) and push notifications.
- **Backup Success Rate:** 100% daily MongoDB automated backups to S3.

## 2. Service Level Indicators (SLIs)
Metrics used to measure SLO compliance:
- **Availability:** (Successful HTTP 2xx & 3xx Requests) / (Total Requests) measured at NGINX.
- **Latency:** Duration of HTTP requests as tracked by Prometheus middleware.
- **Error Rate:** Ratio of HTTP 5xx errors to total requests.
- **Throughput:** Requests per second (RPS).
- **Queue Health:** Number of pending vs. failed background jobs.
- **Worker Health:** Heartbeat status of the Background Job Scheduler.
- **Database Health:** Active connections, query execution times, replication lag.

## 3. Error Budget
The acceptable risk profile for the application:
- **Monthly Downtime Allowance:** 43.8 minutes (targeting 99.9% uptime).
- **Alert Thresholds:** 
  - Alert triggered if 10% of 30-day error budget is burned in 1 hour.
  - Alert triggered if 5% of 30-day error budget is burned in 5 minutes.
- **Escalation Policy:** If budget drops below 50% for the month, feature deployments freeze.
- **Recovery Expectations:** Bugs causing budget burn must be prioritized over all new features.

## 4. Business KPI Dashboard (Grafana)
### Platform
- Active Users, Daily Active Users (DAU), Monthly Active Users (MAU).
### Marketplace
- Number of active Equipment Bookings.
- Number of Marketplace Orders per day.
- Payment Success Rate (via Razorpay webhooks).
### AI
- AI Doctor Requests volume.
- AI Response Time (Gemini API latency).
### Infrastructure
- CPU, Memory, and Disk usage across Docker containers.
- Database Connection Pool Usage.

## 5. Cost Monitoring
- **Cloud Costs:** Set AWS/Render billing alerts for 75% and 100% of the monthly budget.
- **Storage Costs:** Monitor Cloudinary bandwidth/storage usage and S3 backup retention policies.
- **API Usage Costs:** Monitor Razorpay transaction fees, Gemini token usage limits, and MSG91 SMS volume costs.
