# KisanO Deployment & Cloud Infrastructure Platform

This directory contains the provider-agnostic deployment mesh for the KisanO Backend.

## Architecture

The deployment architecture is completely decoupled from any single cloud provider. It provides abstractions for:
- **Docker Compose** (MVP / Single Node)
- **Kubernetes** (Future Multi-Node / Auto-Scaling)
- **Terraform** (Future Infrastructure as Code)

### NGINX Edge Layer
We use NGINX strictly as a Layer 7 Reverse Proxy to handle SSL termination, gzip compression, and edge rate-limiting. It acts as the gateway before requests hit the FastAPI backend.

### Deployment Engine
All operational tasks are funneled through `scripts/deployment_engine.sh`.

```bash
# 1. Zero-Downtime Deployment
./scripts/deployment_engine.sh deploy production

# 2. Automated Backups
./scripts/deployment_engine.sh backup production

# 3. Point-in-Time Recovery
./scripts/deployment_engine.sh restore production kisano_mongodb_2026-08-01_00-00-00.archive

# 4. Emergency Rollback
./scripts/deployment_engine.sh rollback production
```

## Scaling Strategy

Currently, horizontal scaling is achieved manually by spinning up larger VMs (Vertical) or running `docker compose up --scale backend=3` (Horizontal per node).

For future hyper-scale, the `kubernetes/` directory is prepared to accept Helm charts utilizing the Horizontal Pod Autoscaler (HPA) to dynamically scale the `backend` and `worker` pods based on CPU/Memory pressure.
