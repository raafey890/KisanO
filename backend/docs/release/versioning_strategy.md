# Versioning Strategy

KisanO Backend adheres strictly to [Semantic Versioning 2.0.0](https://semver.org/).

Given a version number `MAJOR.MINOR.PATCH`, we increment the:
1. **MAJOR** version when we make incompatible API changes (e.g., deprecating `/api/v1` entirely).
2. **MINOR** version when we add functionality in a backward-compatible manner (e.g., adding a new `AI Plant Doctor` endpoint).
3. **PATCH** version when we make backward-compatible bug fixes.

## Release Process
1. Development occurs on the `develop` branch.
2. When ready for release, a `release/vX.Y.Z` branch is created.
3. The **Production Readiness Checklist** is executed.
4. The branch is merged into `main` and tagged with `vX.Y.Z`.
5. The CI/CD pipeline detects the tag and automatically deploys to Production.
