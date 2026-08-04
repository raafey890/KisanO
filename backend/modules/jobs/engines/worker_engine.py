from typing import Callable
from modules.jobs.providers import AsyncJobProvider

class WorkerEngine:
    def __init__(self):
        # We use the Async Provider for the MVP
        self.provider = AsyncJobProvider()
        
    def register_worker(self, name: str, func: Callable):
        self.provider.register_worker(name, func)

    async def start_workers(self, num_workers: int = 3):
        await self.provider.start_workers(num_workers)

worker_engine = WorkerEngine()
