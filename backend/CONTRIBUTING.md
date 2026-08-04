# Contributing to KisanO Backend

First off, thank you for considering contributing to KisanO! 

## Branching Strategy

We follow a strict Gitflow workflow:
- `main`: Production-ready state.
- `develop`: Next release integration branch.
- `feature/<name>`: New features. Must branch from `develop`.
- `bugfix/<name>`: Bug fixes.
- `hotfix/<name>`: Critical production fixes. Branches from `main`.

## Pull Request Process

1. Ensure your code strictly adheres to our **Clean Architecture** patterns (Controllers -> Services -> Repositories -> Models).
2. All new logic must be accompanied by Pytest coverage. If coverage drops below 80%, the CI pipeline will reject the PR.
3. If you introduce a major architectural change, you MUST submit a new [ADR (Architecture Decision Record)](docs/adr/) for team approval first.
4. Fill out the PR template completely.

## Coding Standards
Please refer to the [Coding Standards Guide](docs/development/coding_standards.md) for specifics on Pydantic v2 validation, Async dependency injection, and centralized exception handling.
