# ADR-002: MongoDB as Primary Datastore

## Context
KisanO handles diverse, unstructured, and rapidly evolving data schemas. Equipment listings have dynamic attributes (e.g., a Tractor has horsepower, a Sprayer has tank capacity). An AI Diagnosis has complex nested bounding boxes and probability scores. Relational databases (PostgreSQL/MySQL) require rigid schemas that would slow down early product iteration and require massive JSONB column workarounds.

## Decision
We will use **MongoDB** as the primary datastore, utilizing the `motor` asynchronous driver.

## Consequences
- **Positive**: Rapid schema iteration. We can add new equipment types and AI models without writing blocking database migrations.
- **Positive**: Deep integration with Python dictionaries / Pydantic models.
- **Negative**: No native multi-document ACID transactions by default (though available in Replica Sets). We must design our CQRS event bus to handle eventual consistency.

## Alternatives Considered
- **PostgreSQL**: Highly relational and ACID compliant, but would severely slow down the development of the dynamic Marketplace and AI Diagnosis modules due to schema rigidity.
