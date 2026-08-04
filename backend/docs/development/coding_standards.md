# Coding Standards & Guidelines

This reference document outlines the non-negotiable coding rules for the KisanO Backend.

## 1. Clean Architecture Violations
- **Rule**: `Routers` cannot contain business logic. They must immediately pass validated DTOs to `Services`.
- **Rule**: `Services` cannot import `fastapi.Request`, `motor.motor_asyncio`, or `redis`. They must operate purely on Python standard types and Pydantic models.
- **Rule**: `Repositories` handle all database queries.

## 2. Dependency Injection
Use FastAPI's `Depends()` exclusively. Do not instantiate `Service` classes globally. This is critical for our testability (injecting Mock Repositories).

## 3. Exception Handling
Do not throw raw `HTTPException` inside business logic.
- Throw custom `AppException`, `UnauthorizedException`, or `NotFoundException` from `core.exceptions`.
- The global error handler in `main.py` will catch these and standardize the JSON response envelope.

## 4. Type Hints & Validation
- **Rule**: Every single function signature must have explicit Python type hints (e.g., `def get_user(user_id: str) -> UserDTO:`).
- **Rule**: Use Pydantic v2 for all payload validation. Do not manually validate dictionaries.
