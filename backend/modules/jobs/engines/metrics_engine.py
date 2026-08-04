from modules.jobs.repository import jobs_repo
from modules.jobs.schemas import JobStats

class MetricsEngine:
    @staticmethod
    async def get_stats() -> JobStats:
        stats = await jobs_repo.get_stats()
        return JobStats(**stats)

metrics_engine = MetricsEngine()
