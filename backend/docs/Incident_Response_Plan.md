# KisanO Incident Response Plan

## 1. Incident Severity Levels

### SEV-1: Critical Outage (Highest Priority)
- **Description:** Complete system failure, core business processes down (e.g., users cannot login, database is unreachable, all payments failing).
- **Response Time Target:** Immediate (within 5 minutes).
- **Resolution Target:** < 1 hour.
- **Escalation Path:** On-call Engineer ➔ Tech Lead ➔ CTO.
- **Communication:** Immediate notification to all stakeholders via internal #incidents channel. Status page update required within 15 minutes.

### SEV-2: Major Impact
- **Description:** Significant functionality degraded, but system remains partially usable (e.g., AI Doctor service is down, image uploads failing, background workers halted).
- **Response Time Target:** < 15 minutes.
- **Resolution Target:** < 4 hours.
- **Escalation Path:** On-call Engineer ➔ Tech Lead.
- **Communication:** Internal #incidents channel notification. Status page updated if user-facing functionality is visibly broken.

### SEV-3: Minor Impact
- **Description:** Non-critical features failing, or degraded performance affecting a subset of users (e.g., delayed SMS delivery, slow reporting queries).
- **Response Time Target:** < 4 hours.
- **Resolution Target:** < 24 hours.
- **Escalation Path:** Routed to engineering queue for triaging by product team.
- **Communication:** Internal ticketing system only.

### SEV-4: Cosmetic / Informational
- **Description:** Typos, minor UI alignment issues, internal tooling errors not affecting production users.
- **Response Time Target:** N/A (Standard sprint planning).
- **Resolution Target:** Next available sprint.
- **Escalation Path:** Standard backlog.
- **Communication:** Standard backlog triage.

## 2. Incident Lifecycle
1. **Detection:** Automated alert triggered via Grafana/Prometheus or user report.
2. **Triage & Classification:** Engineer acknowledges alert and determines SEV level.
3. **Mitigation:** Primary goal is to restore service (rollback, failover, traffic shaping), not necessarily to fix the root cause.
4. **Resolution:** Service restored to normal operation metrics.
5. **Post-Mortem (RCA):** Required for all SEV-1 and SEV-2 incidents. Document timeline, root cause, and preventative action items within 48 hours of resolution.
