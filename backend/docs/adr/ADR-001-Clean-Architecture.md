# ADR-001: Clean Architecture

## Context
KisanO is projected to scale rapidly, both in codebase size and developer count. A disorganized monolith (e.g., Active Record pattern with UI logic bleeding into database models) will inevitably lead to a "Big Ball of Mud" architecture, slowing down feature delivery and making microservice migration impossible.

## Decision
We will strictly adhere to **Clean Architecture**. The codebase is separated into independent layers:
1. **Routers (Controllers)**: Handle HTTP requests and FastAPI specific logic.
2. **Services (Use Cases)**: Pure Python business logic. No HTTP knowledge. No database driver knowledge.
3. **Repositories**: The only layer allowed to import `motor.motor_asyncio` to execute database queries.

## Consequences
- **Positive**: Absolute testability. We can unit test `Services` by simply injecting mock `Repositories`.
- **Positive**: Database portability. We can swap MongoDB for PostgreSQL by rewriting Repositories without changing a single line of business logic.
- **Negative**: Increased boilerplate. A simple CRUD endpoint requires writing a Router, a Service, a Repository, and Pydantic DTOs.

## Alternatives Considered
- **Django (Active Record)**: Rejected due to tight coupling between the ORM and business logic, violating the goal of a decoupled architecture.
