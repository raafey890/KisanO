from typing import Dict, Any, List
from shared.base_repository import BaseRepository
from datetime import datetime, timezone
from modules.jobs.constants import JobState

class JobsRepository(BaseRepository):
    def __init__(self):
        super().__init__("jobs")

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

class JobHistoryRepository(BaseRepository):
    def __init__(self):
        super().__init__("job_history")

class DeadLetterRepository(BaseRepository):
    def __init__(self):
        super().__init__("dead_letter_jobs")

jobs_repo = JobsRepository()
job_history_repo = JobHistoryRepository()
dead_letter_repo = DeadLetterRepository()
