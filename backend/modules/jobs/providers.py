import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Callable
from modules.jobs.constants import JobPriority, JobState
from modules.jobs.repository import jobs_repo, job_history_repo

logger = logging.getLogger(__name__)

class BaseJobProvider(ABC):
    @abstractmethod
    async def enqueue(self, job_doc: Dict[str, Any]):
        pass
        
    @abstractmethod
    def register_worker(self, name: str, func: Callable):
        pass


class InMemoryJobProvider(BaseJobProvider):
    """Fire and forget for testing"""
    def __init__(self):
        self._workers = {}

    def register_worker(self, name: str, func: Callable):
        self._workers[name] = func

    async def enqueue(self, job_doc: Dict[str, Any]):
        worker_name = job_doc.get("worker_name")
        func = self._workers.get(worker_name)
        if func:
            try:
                await func(job_doc.get("args", {}))
            except Exception as e:
                logger.error(f"In-memory worker {worker_name} failed: {e}")


class AsyncJobProvider(BaseJobProvider):
    """
    Production-ready internal async queue simulating a distributed broker.
    Executes in the background via asyncio tasks.
    """
    def __init__(self):
        self._workers = {}
        self._queue = asyncio.PriorityQueue()
        self._running = False
        self._worker_tasks = []

    def register_worker(self, name: str, func: Callable):
        self._workers[name] = func

    async def start_workers(self, num_workers: int = 3):
        self._running = True
        for i in range(num_workers):
            task = asyncio.create_task(self._worker_loop(f"worker-{i}"))
            self._worker_tasks.append(task)
            
    async def _worker_loop(self, worker_id: str):
        while self._running:
            try:
                priority_int, job_doc = await self._queue.get()
                await self._process_job(job_doc)
                self._queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[{worker_id}] Unhandled error: {e}")

    async def _process_job(self, job_doc: Dict[str, Any]):
        job_id = str(job_doc["_id"])
        worker_name = job_doc["worker_name"]
        func = self._workers.get(worker_name)
        
        # Mark Running
        await jobs_repo.update(job_id, {"state": JobState.RUNNING.value})
        
        if not func:
            await self._handle_failure(job_id, f"Worker {worker_name} not found")
            return
            
        try:
            await func(job_doc.get("args", {}))
            # Mark Completed
            await jobs_repo.update(job_id, {"state": JobState.COMPLETED.value})
            
            # Archive History
            job_doc["state"] = JobState.COMPLETED.value
            await job_history_repo.create(job_doc)
            await jobs_repo.delete(job_id)
            
        except Exception as e:
            await self._handle_failure(job_id, str(e))

    async def _handle_failure(self, job_id: str, error_msg: str):
        logger.error(f"Job {job_id} failed: {error_msg}")
        # In a real implementation, this pushes back to RetryEngine
        await jobs_repo.update(job_id, {"state": JobState.FAILED.value, "error": error_msg})

    async def enqueue(self, job_doc: Dict[str, Any]):
        # Map priority string to integer for PriorityQueue
        priorities = {
            JobPriority.CRITICAL.value: 1,
            JobPriority.HIGH.value: 2,
            JobPriority.NORMAL.value: 3,
            JobPriority.LOW.value: 4,
            JobPriority.BACKGROUND.value: 5
        }
        p_val = priorities.get(job_doc.get("priority", JobPriority.NORMAL.value), 3)
        await self._queue.put((p_val, job_doc))
