# Local Setup Guide (Tutorial)

Welcome to the KisanO Backend! This tutorial will get you up and running locally in under 5 minutes.

## Prerequisites
- Docker & Docker Compose
- Python 3.11+ (if running outside Docker)
- Git

## Step 1: Clone & Configure
```bash
git clone https://github.com/kisano/backend.git
cd backend
cp .env.example .env
```

## Step 2: Boot the Stack
We use the unified Deployment Engine to boot the local development environment:
```bash
./deployment/scripts/deployment_engine.sh deploy development
```
This command spins up:
- FastAPI Backend (Port 8000)
- MongoDB Container
- Redis Container
- NGINX Edge Proxy (Port 80)

## Step 3: Verify
Visit `http://localhost/health`. You should see a JSON payload indicating `STATUS: UP`.

## Running Tests
Tests run incredibly fast because they use `mongomock-motor` by default.
```bash
pytest --cov=modules
```

## Next Steps
Read the [Coding Standards Guide](coding_standards.md) to understand our Clean Architecture rules before writing your first PR.
