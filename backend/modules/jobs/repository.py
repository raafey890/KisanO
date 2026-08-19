from typing import Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from modules.jobs.constants import JobState
from bson import ObjectId

class JobsRepository(BaseRepository):
    def __init__(self):
        super().__init__("jobs")

    async def setup_indexes(self):
        await self.collection.create_index("idempotency_key")
        await self.collection.create_index("state")

    async def generate_job_number(self) -> str:
        # MVP generation: In production use Redis INCR or MongoDB atomic counters
        count = await self.collection.count_documents({}) + 1
        year = datetime.now().year
        return f"JOB-{year}-{str(count).zfill(6)}"
        
    async def get_stats(self) -> Dict[str, int]:
        queued = await self.collection.count_documents({"state": JobState.QUEUED.value})
        running = await self.collection.count_documents({"state": JobState.RUNNING.value})
        completed = await self.collection.count_documents({"state": JobState.COMPLETED.value})
        failed = await self.collection.count_documents({"state": JobState.FAILED.value})
        dlq = await self.collection.count_documents({"state": JobState.DEAD_LETTER.value})
        return {
            "queued": queued,
            "running": running,
            "completed": completed,
            "failed": failed,
            "dead_letter": dlq
        }

    async def find_by_idempotency_key(self, key: str) -> Dict[str, Any]:
        return await self.collection.find_one({
            "idempotency_key": key,
            "state": {"$in": [JobState.QUEUED.value, JobState.RUNNING.value, JobState.PENDING.value]}
        })

    async def claim_job(self, job_id: str) -> bool:
        """Atomically claim a job by setting its state to RUNNING if it's QUEUED or PENDING."""
        result = await self.collection.update_one(
            {"_id": ObjectId(job_id), "state": {"$in": [JobState.QUEUED.value, JobState.PENDING.value]}},
            {
                "$set": {
                    "state": JobState.RUNNING.value,
                    "started_at": datetime.now(timezone.utc)
                }
            }
        )
        return result.modified_count > 0

class JobHistoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("job_history")

class DeadLetterRepository(BaseRepository):
    def __init__(self):
        super().__init__("dead_letter_jobs")

jobs_repo = JobsRepository()
job_history_repo = JobHistoryRepository()
dead_letter_repo = DeadLetterRepository()
