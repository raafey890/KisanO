from typing import Dict, Any, List
from modules.jobs.job_engine import job_engine
from modules.jobs.schemas import JobStats
from modules.jobs.repository import jobs_repo, job_history_repo, dead_letter_repo

class JobService:
    @staticmethod
    async def get_stats() -> JobStats:
        return await job_engine.get_stats()

    @staticmethod
    async def get_active_jobs(skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        cursor = jobs_repo.collection.find().sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        for i in items: i["id"] = str(i["_id"])
        total = await jobs_repo.collection.count_documents({})
        return items, total
        
    @staticmethod
    async def get_dlq_jobs(skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        cursor = dead_letter_repo.collection.find().sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        for i in items: i["id"] = str(i["_id"])
        total = await dead_letter_repo.collection.count_documents({})
        return items, total

    @staticmethod
    async def replay_dlq_job(job_id: str):
        await job_engine.replay_dlq(job_id)
