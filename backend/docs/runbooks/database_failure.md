# Runbook: MongoDB Failure

## Context
This runbook covers the scenario where the primary MongoDB cluster goes offline or becomes corrupted.

## Symptoms
- `/health` endpoint reports `DOWN` for database dependency.
- Error logs spike with `pymongo.errors.ServerSelectionTimeoutError`.
- `MonitoringEngine` sends a P1 Alert to PagerDuty.

## Immediate Actions
1. **Enable Global Maintenance Mode**:
   Execute a request to the Gateway Admin API to enable maintenance mode. This stops the API from accepting new requests and returning confusing 500 errors to clients, instead returning a clean `503 Service Unavailable`.
   
2. **Check Container Logs**:
   ```bash
   docker compose logs mongodb --tail 200
   ```

## Diagnosis
- **OOM (Out of Memory)**: If the kernel killed the MongoDB process, you will see `OOMKilled` in Docker stats. Increase the VM size.
- **Corrupted WiredTiger Storage**: If MongoDB refuses to boot due to a dirty shutdown. Proceed to Recovery.

## Recovery Steps
Follow the official disaster recovery scripts:
1. Locate the latest backup in `deployment/backup/archives/`.
2. Run the Restore Manager:
   ```bash
   ./deployment/scripts/deployment_engine.sh restore production <latest_archive_name>
   ```

## Verification
- Hit `/health` and ensure it reports `UP`.
- Disable Global Maintenance Mode on the Gateway.
- Escalate to the DevOps Lead if recovery fails.
