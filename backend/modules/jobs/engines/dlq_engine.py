import logging
from typing import Dict, Any
from modules.jobs.repository import dead_letter_repo, jobs_repo
from modules.jobs.constants import JobState

logger = logging.getLogger(__name__)

class DLQEngine:
    @staticmethod
    async def move_to_dlq(job_id: str, error_msg: str):
        logger.warning(f"Moving Job {job_id} to Dead Letter Queue. Error: {error_msg}")
        job_doc = await jobs_repo.get(job_id)
        if job_doc:
            job_doc["state"] = JobState.DEAD_LETTER.value
            job_doc["error"] = error_msg
            await dead_letter_repo.create(job_doc)
            await jobs_repo.delete(job_id)

dlq_engine = DLQEngine()
