import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class SchedulerEngine:
    def __init__(self):
        self._crons = []

    def schedule_cron(self, worker_name: str, args: Dict[str, Any], cron_expr: str):
        """
        Registers a job to run at a specific schedule.
        """
        self._crons.append({
            "worker_name": worker_name,
            "args": args,
            "cron_expr": cron_expr
        })
        logger.info(f"Registered cron for {worker_name}: {cron_expr}")

    async def check_crons(self):
        """
        Called periodically by the scheduler runner.
        In a real implementation, this evaluates the cron expression.
        """
        from modules.jobs.job_engine import job_engine
        for job in self._crons:
            logger.info(f"Scheduler enqueueing {job['worker_name']}")
            await job_engine.enqueue(job["worker_name"], job["args"])


scheduler_engine = SchedulerEngine()
