# KisanO Backend Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-success.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

KisanO is a global-scale SaaS platform connecting farmers with advanced equipment, sprayer services, and AI-driven plant diagnostics.

This repository contains the enterprise-grade Backend Infrastructure powering the entire ecosystem, built on **Clean Architecture**, **Zero-Trust Security**, and **Event-Driven CQRS**.

## 🚀 Quick Start

See the [Local Setup Guide](docs/development/local_setup.md) for detailed instructions on booting the stack via Docker Compose.

```bash
git clone https://github.com/kisano/backend.git
cd backend
cp .env.example .env
./deployment/scripts/deployment_engine.sh deploy development
```

## 📚 Documentation Index

Our documentation follows the [Diátaxis Framework](https://diataxis.fr/) (Tutorials, How-to, Reference, Explanation).

- **[Architecture & Design](docs/architecture/system_overview.md)**
- **[Architecture Decision Records (ADRs)](docs/adr/)**
- **[API Integration Guides](docs/api/)**
- **[Developer Onboarding](docs/development/local_setup.md)**
- **[Disaster Recovery Runbooks](docs/runbooks/)**
- **[Production Readiness & Release](docs/release/production_readiness.md)**

## 🛡️ Security

Please read our [Security Policy](SECURITY.md) for reporting vulnerabilities. All requests are governed by our unified `SecurityEngine`.

## 🤝 Contributing

We welcome contributions! Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

## 📄 License

Proprietary and Confidential. All rights reserved.
