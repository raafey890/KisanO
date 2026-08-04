# KisanO Master Project Specification (MPS)

## 1. Project Overview

### Mission
To empower the agricultural ecosystem by providing a unified, digital platform that connects farmers, equipment owners, service providers, and agricultural experts, maximizing yield and operational efficiency.

### Vision
To become the definitive operating system for modern agriculture, ensuring every farmer, regardless of scale, has access to enterprise-grade tools, AI-driven agronomic intelligence, and a seamless marketplace.

### Problem Statement
Traditional farming operations suffer from fragmented supply chains, lack of accessible high-tech equipment, delayed disease diagnosis, and inefficient operational management. Farmers struggle to find reliable equipment rentals and verified spraying operators, while equipment owners face low utilization rates due to a lack of visibility.

### Solution
KisanO bridges this gap through a comprehensive Modular Monolith platform featuring:
- An Equipment Rental Network.
- A robust Marketplace for agricultural goods.
- Specialized Sprayer Service scheduling.
- An AI-powered Plant Doctor for real-time crop disease diagnosis.
- Centralized Payments, Notifications, and Support.

### Business Model
KisanO operates as a multi-sided marketplace generating revenue through:
- **Platform Commissions**: A percentage fee on completed equipment bookings, marketplace orders, and sprayer service contracts.
- **Featured Listings**: Premium placement for equipment and marketplace products.
- **Subscription Tiers (Future)**: Premium analytics and advanced AI consultations for large-scale farm operations.

### Future Vision
Integrating IoT sensors, drone imagery, satellite analytics, and multilingual capabilities to create a hyper-localized, predictive agricultural network.

---

## 2. System Architecture

### Overall Architecture
KisanO utilizes a **Modular Monolith** architecture. It provides the deployment simplicity of a monolithic application while enforcing the strict boundaries, independent scaling potential, and decoupled domains of a microservices architecture.

### Frontend Architecture
A Single Page Application (SPA) built with React and Vite. It utilizes context providers for global state, custom hooks for API integration, and modular component design for reusability. The UI is built to be mobile-first and responsive.

### Backend Architecture
Built on **Clean Architecture** principles using FastAPI. Each domain (e.g., Users, Equipment, Orders) is encapsulated in its own module. Modules communicate through strict service interfaces, never bypassing business logic to access the database directly.

### Database Architecture
A NoSQL approach using MongoDB. Data is structured to balance normalization (for consistency) and denormalization (for read performance). Aggregation pipelines are used for complex cross-collection queries (e.g., Analytics Dashboard).

### AI Architecture
An abstract Provider/Factory pattern encapsulates AI services (e.g., OpenAI). The core business logic interacts with an `IAIProvider` interface, allowing the platform to swap models (e.g., to Anthropic or local open-source LLMs) without refactoring business logic.

### Payment Architecture
Centralized payment module wrapping external gateways (e.g., Razorpay/Stripe). It handles intent creation, webhook verification, status synchronization, and commission splits.

### Notification Architecture
An asynchronous background worker queue (using `asyncio` or Celery) orchestrates FCM (Push), Email, and In-App notifications. Users maintain granular preference toggles.

### Deployment Architecture
Containerized using Docker and orchestrated via Docker Compose. The environment sits behind an Nginx reverse proxy providing SSL termination and rate-limiting, heavily monitored by Prometheus and Grafana.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS (if applicable), Axios, React Router.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Motor (Async MongoDB).
- **Database**: MongoDB Atlas (or local MongoDB 6.0).
- **Cloud/Storage**: Cloudinary (Media), AWS S3 (Exports/Backups readiness).
- **Authentication**: JWT (JSON Web Tokens) with strict RBAC.
- **AI**: OpenAI GPT-4o (Vision-capable) via Factory Pattern.
- **Payment Gateway**: Razorpay (Mocked/Abstracted).
- **Notifications**: Firebase Cloud Messaging (FCM).
- **DevOps**: Docker, Docker Compose, Nginx, GitHub Actions.
- **Monitoring**: Prometheus, Grafana, Loki (Logging).

---

## 4. User Roles

1. **Farmer**: Primary consumer. Books equipment, buys products, requests AI diagnostics.
2. **Equipment Owner**: Lists tractors, harvesters, etc., for rent. Manages booking approvals.
3. **Sprayer Operator**: Lists specialized crop-spraying services and manages schedules.
4. **Seller**: Verified vendor listing seeds, fertilizers, and tools in the Marketplace.
5. **Support Agent**: Manages customer inquiries, resolves disputes, updates tickets.
6. **Admin**: Oversees platform operations, moderates content, views analytics.
7. **Super Admin**: Full system control, manages other admins, system configurations.

---

## 5. Complete Feature List

- **Auth Module**: Registration, login, OTP verification, JWT generation, password resets.
- **Users Module**: Profile management, KYC verification, role assignment, location tracking.
- **Equipment Module**: CRUD for equipment listings, availability toggling, category management.
- **Equipment Booking Module**: Booking state machine (Pending -> Approved -> In Progress -> Completed/Cancelled).
- **Marketplace Module**: E-commerce catalog, wishlists, product search, brand filtering.
- **Orders Module**: Cart checkout, shipping tracking, delivery confirmation.
- **Sprayer Services Module**: Operator profiles, service radius, chemical specialties.
- **Sprayer Booking Module**: Scheduling, status tracking, field location mapping.
- **Payments Module**: Transaction processing, refund handling, commission calculation.
- **AI Plant Doctor Module**: Image-based disease diagnosis, conversational agronomy advice.
- **Reviews & Ratings Module**: Verified feedback for equipment, products, and operators.
- **Notifications Module**: Omnichannel alerts (Push, Email, In-app), preference management.
- **Support & Help Center Module**: Ticketing system, internal notes, FAQs, Knowledge Base.
- **Admin Management Module**: Global dashboard, user suspension, system settings (maintenance mode), audit logging.
- **Analytics & Reports Module**: BI engine, metric aggregation across all domains, scheduled reporting, data export.

---

## 6. Module Dependency Diagram

Strict unidirectional dependencies prevent circular imports:
- **Core (Shared)** has zero dependencies.
- **Auth/Users** are foundational.
- **Equipment/Marketplace/Sprayer Services** depend on Users.
- **Bookings/Orders** depend on their respective domains + Users + Payments.
- **Reviews** depends on Bookings/Orders (verification constraint).
- **Admin/Analytics** depend on *all* modules for orchestration and data aggregation.

*(Note: Direct database cross-talk between modules is prohibited. Modules must use the `Service` layer of other modules to interact.)*

---

## 7. Complete API Standards

- **REST Standards**: Nouns for resources (`/users`, `/equipment`), HTTP verbs for actions (`GET`, `POST`, `PATCH`, `DELETE`).
- **Versioning**: All endpoints prefixed with `/api/v1/`.
- **Naming Convention**: `camelCase` for JSON request/response bodies. `snake_case` for URL paths (e.g., `/equipment-bookings`).
- **Response Format**: 
  ```json
  { "success": true, "message": "Success", "data": { ... } }
  ```
- **Error Format**: 
  ```json
  { "success": false, "message": "Error description", "errors": [] }
  ```
- **Authentication**: Bearer Token via `Authorization` header.
- **Pagination**: Query parameters `?skip=0&limit=20`.
- **Filtering & Sorting**: Query parameters `?status=ACTIVE&sortBy=newest`.

---

## 8. Database Standards

- **Collections**: Pluralized snake_case (e.g., `equipment_bookings`, `support_tickets`).
- **Naming**: Fields use camelCase inside documents (e.g., `createdAt`, `userId`).
- **Indexes**: Applied to all frequently queried fields (`userId`, `status`, `category`). Compound indexes for complex dashboard queries.
- **Relationships**: Normalized references (storing `ObjectId`) for large interconnected data. Denormalization (embedding snapshots) used for immutable data like Order History prices.
- **Soft Delete**: Records are rarely hard-deleted. Use `isActive: false` or `status: DELETED`.
- **Audit Fields**: Every document must contain `createdAt` and `updatedAt` (UTC).

---

## 9. Coding Standards

- **Folder Structure**: Clean Architecture inside each module (`router.py`, `service.py`, `repository.py`, `schemas.py`, `models.py`).
- **Naming Convention**: 
  - Python variables/functions: `snake_case`
  - Python classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
- **Comments**: Docstrings for complex business logic, explicit types in function signatures.
- **SOLID & Clean Architecture**: Controllers (Routers) only parse HTTP. Services handle business rules. Repositories handle MongoDB drivers.
- **Dependency Injection**: FastAPI `Depends()` used extensively for auth and database sessions.

---

## 10. Security Standards

- **JWT**: Short-lived access tokens, strict secret management via `.env`.
- **RBAC**: Multi-layered Role-Based Access Control enforced at the router level.
- **Encryption/Hashing**: Passwords hashed using `bcrypt` (via `passlib`).
- **Validation**: Pydantic v2 strict typing and bounds checking (e.g., `min_length`, `ge`).
- **Rate Limiting**: Configured at the Nginx level (e.g., 10 req/sec) and application level.
- **Audit Logs**: All admin actions recorded in `admin_audit_logs`.
- **OWASP**: Nginx headers (HSTS, CSP, X-XSS-Protection) block common vulnerabilities.

---

## 11. Frontend Standards

- **React / Vite**: Fast build tooling, strict mode enabled.
- **Component Structure**: Atomic design (Atoms, Molecules, Organisms, Pages).
- **Hooks**: Custom hooks encapsulate complex side effects and API calls.
- **Styling**: TailwindCSS for utility-first, rapid, and consistent styling.
- **Responsive Design**: Mobile-first media queries.

---

## 12. Backend Standards

- **FastAPI / Motor**: Fully asynchronous I/O to handle thousands of concurrent connections.
- **Validation**: Centralized through Pydantic. No raw dictionary manipulation without validation.
- **Error Handling**: Global exception handlers catch `AppException`, `NotFoundException`, formatting them into standard HTTP responses.

---

## 13. AI Standards

- **Prompt Engineering**: System prompts are externalized as constants/templates, not hardcoded into logic.
- **Provider Abstraction**: Factory pattern prevents vendor lock-in.
- **Caching**: Future-ready for Redis caching to prevent identical image re-analysis.
- **Retries**: Asynchronous tasks support automatic exponential backoff.
- **History**: AI consultation sessions store `conversationHistory` arrays.

---

## 14. Deployment Standards

- **Docker**: Multi-stage builds targeting Python 3.11 slim, running as non-root `appuser`.
- **Nginx**: Reverse proxy handling HTTPS, compression, and request sizing.
- **GitHub Actions**: Automated CI/CD. Linting, typing, and testing on PRs. Automated deployment on release tags.
- **Monitoring / Logging**: Prometheus scraping `/metrics`. Container logs captured via Docker json-file driver.
- **Backups**: Automated bash scripts taking `mongodump` archives daily.

---

## 15. Testing Standards

- **Unit Tests**: Test isolation for complex business logic (e.g., state machine transitions).
- **Integration Tests**: Tests combining Service and Repository layers using a test MongoDB instance.
- **API Tests**: FastAPI `TestClient` mimicking HTTP requests.
- **Coverage**: Target minimum 80% coverage on core business domains.

---

## 16. Git Standards

- **Branches**: `main` (Production), `develop` (Staging), `feature/name` (Development).
- **Commit Messages**: Conventional Commits standard (e.g., `feat: add booking system`, `fix: correct status bug`).
- **Pull Requests**: Require minimum 1 approval, passing CI pipeline.
- **Release Strategy**: Semantic versioning tags (e.g., `v1.2.0`) trigger production deployment.

---

## 17. Folder Structure

**Backend (Modular Monolith)**:
```text
backend/
├── core/              # Global config, exceptions, security dependencies
├── db/                # MongoDB connection singleton
├── docs/              # Deployment guides, MPS
├── monitoring/        # Prometheus, Grafana configs
├── nginx/             # Nginx configurations
├── scripts/           # CI/CD and operational bash scripts
├── shared/            # Common schemas, standard responses
├── modules/           # Business Domains
│   ├── auth/
│   ├── users/
│   ├── equipment/
│   ├── ...
│   └── analytics/
│       ├── __init__.py
│       ├── router.py
│       ├── service.py
│       ├── repository.py
│       ├── schemas.py
│       └── constants.py
├── main.py            # Application entry point
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## 18. Development Workflow

1. **Feature Development**: Developer branches off `develop`. Writes code adhering to Clean Architecture.
2. **Testing**: Developer writes `pytest` coverage for new modules.
3. **Review**: Pull Request opened to `develop`. CI runs formatting (Black), Linting (Flake8), and Tests. Peer review approves.
4. **Deployment**: Release branch merged to `main`. Tag pushed. GitHub Actions CD builds Docker image and deploys to production.

---

## 19. Production Checklist

- [ ] `.env.prod` populated with secure production secrets.
- [ ] MongoDB Atlas cluster provisioned, networked, and IP-whitelisted.
- [ ] Nginx SSL certificates installed (e.g., Let's Encrypt certbot).
- [ ] Admin Super User seeded.
- [ ] Scheduled backup CRON jobs active.
- [ ] Grafana alerts configured for High CPU / 5xx Errors.
- [ ] Rate limits actively tested.
- [ ] DNS A-Records pointing to production server.

---

## 20. Future Roadmap

- **Mobile App**: Launching cross-platform React Native / Flutter apps.
- **IoT Integration**: Tracking tractor GPS coordinates and engine hours in real-time.
- **Drone & Satellite Analysis**: Syncing multispectral farm imagery into the AI Plant Doctor.
- **AI Prediction**: Demand forecasting and dynamic pricing for Marketplace goods based on weather patterns.
- **Government Integration**: Syncing with official land registries and subsidy APIs.
- **Multilingual Support**: Real-time localization for vernacular languages across rural demographics.

---
*End of Master Project Specification.*
