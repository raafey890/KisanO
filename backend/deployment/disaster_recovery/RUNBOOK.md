# Disaster Recovery Runbook

This document outlines the standard operating procedures for critical failure scenarios in the KisanO Backend deployment.

## Scenario 1: MongoDB Data Corruption / Loss

**Symptoms**: Data is missing, queries fail with corruption errors, or the database container crashes continually on boot.

**Recovery Steps**:
1. Identify the last known good backup from the `backup/archives` directory (or S3).
2. Execute the Restore Manager:
   ```bash
   ./scripts/deployment_engine.sh restore production kisano_mongodb_2026-08-01_00-00-00.archive
   ```
3. The script will automatically stop the API, wipe the corrupted DB, restore the archive, and reboot the API.
4. Verify health via `curl -f http://localhost/health`.

## Scenario 2: Bad Code Deployment (API Crash)

**Symptoms**: The `/health` check fails immediately after a deploy, or users report 500 Internal Server Errors en masse.

**Recovery Steps**:
1. Execute the Rollback Manager:
   ```bash
   ./scripts/deployment_engine.sh rollback production
   ```
2. The script will revert to the previously running container image.
3. Investigate the failure via `docker compose logs backend`.

## Scenario 3: Complete Node / VM Failure

**Symptoms**: The entire server is unresponsive. SSH fails.

**Recovery Steps**:
1. Provision a new VM on the cloud provider.
2. Clone the KisanO Backend repository.
3. Download the latest `kisano_mongodb_*.archive` and `.env` files from secure external storage (e.g., AWS S3, Vault).
4. Run standard deployment: `./scripts/deployment_engine.sh deploy production`.
5. Run restore: `./scripts/deployment_engine.sh restore production <archive>`.
6. Update DNS (Cloudflare/Route53) to point to the new VM IP address.
