import logging
from typing import Dict, Any
from datetime import datetime, timezone
from modules.jobs.constants import JobPriority, JobState
from modules.jobs.repository import jobs_repo, dead_letter_repo
from modules.jobs.engines.worker_engine import worker_engine
from modules.jobs.engines.metrics_engine import metrics_engine
from modules.jobs.engines.scheduler_engine import scheduler_engine

logger = logging.getLogger(__name__)


class JobEngine:
    """
    Unified Orchestrator for the Background Jobs Module.
    Business modules interact strictly with this interface.
    """
    
    @staticmethod
    def register_worker(name: str, func: callable):
        worker_engine.register_worker(name, func)

    @staticmethod
    async def enqueue(worker_name: str, args: Dict[str, Any] = None, priority: JobPriority = JobPriority.NORMAL) -> str:
        """
        Guarantees Job Persistence before execution.
        """
        import json
        import hashlib
        
        args = args or {}
        
        # Generate idempotency key
        args_str = json.dumps(args, sort_keys=True)
        args_hash = hashlib.sha256(args_str.encode()).hexdigest()
        timestamp_bucket = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        idempotency_key = f"{worker_name}:{args_hash}:{timestamp_bucket}"
        
        # Check if already queued or running
        existing_job = await jobs_repo.find_by_idempotency_key(idempotency_key)
        if existing_job:
            logger.info(f"Job {worker_name} with key {idempotency_key} is already queued or running. Skipping.")
            return str(existing_job["_id"])

        job_number = await jobs_repo.generate_job_number()
        job_doc = {
            "job_number": job_number,
            "idempotency_key": idempotency_key,
            "worker_name": worker_name,
            "args": args,
            "priority": priority.value,
            "state": JobState.QUEUED.value,
            "created_at": datetime.now(timezone.utc),
            "retry_count": 0
        }
        
        # 1. Persist to MongoDB First
        created_job = await jobs_repo.create(job_doc)
        job_id = str(created_job["_id"])
        job_doc["_id"] = job_id  # Inject string ID for provider
        
        # 2. Enqueue to Provider
        await worker_engine.provider.enqueue(job_doc)
        
        return job_id

    @staticmethod
    async def schedule_cron(worker_name: str, args: Dict[str, Any], cron_expr: str):
        scheduler_engine.schedule_cron(worker_name, args, cron_expr)

    @staticmethod
    async def replay_dlq(job_id: str):
        """
        Pulls a job from the Dead Letter Queue and re-enqueues it.
        """
        job_doc = await dead_letter_repo.get(job_id)
        if not job_doc:
            raise ValueError("Job not found in DLQ")
            
        # Clean up DLQ
        await dead_letter_repo.delete(job_id)
        
        # Reset State and re-queue
        job_doc["state"] = JobState.QUEUED.value
        job_doc["retry_count"] = 0
        job_doc.pop("error", None)
        
        await jobs_repo.create(job_doc)
        await worker_engine.provider.enqueue(job_doc)

    @staticmethod
    async def get_stats():
        return await metrics_engine.get_stats()


job_engine = JobEngine()
