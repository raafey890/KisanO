import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Callable
from modules.jobs.constants import JobPriority, JobState
from modules.jobs.repository import jobs_repo, job_history_repo
from modules.jobs.engines.heartbeat_engine import heartbeat_engine

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
            worker_id = f"worker-{i}"
            heartbeat_engine.register_worker(worker_id)
            task = asyncio.create_task(self._worker_loop(worker_id))
            self._worker_tasks.append(task)
            
    async def _worker_loop(self, worker_id: str):
        while self._running:
            try:
                heartbeat_engine.record_heartbeat(worker_id)
                priority_int, job_doc = await asyncio.wait_for(self._queue.get(), timeout=10.0)
                heartbeat_engine.record_heartbeat(worker_id, current_job_id=str(job_doc["_id"]))
                await self._process_job(job_doc)
                self._queue.task_done()
                heartbeat_engine.record_heartbeat(worker_id)
            except asyncio.TimeoutError:
                continue
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"[{worker_id}] Unhandled error: {e}")

    async def _process_job(self, job_doc: Dict[str, Any]):
        from datetime import datetime, timezone
        job_id = str(job_doc["_id"])
        worker_name = job_doc["worker_name"]
        func = self._workers.get(worker_name)
        
        # Atomically claim job
        claimed = await jobs_repo.claim_job(job_id)
        if not claimed:
            logger.info(f"Job {job_id} already claimed or processed. Skipping.")
            return
        
        if not func:
            await self._handle_failure(job_doc, f"Worker {worker_name} not found")
            return
            
        try:
            start_time = datetime.now(timezone.utc)
            await func(job_doc.get("args", {}))
            end_time = datetime.now(timezone.utc)
            
            processing_time_ms = int((end_time - start_time).total_seconds() * 1000)

            # Mark Success
            await jobs_repo.update(job_id, {
                "state": JobState.SUCCESS.value,
                "completed_at": end_time,
                "processing_time_ms": processing_time_ms
            })
            
            # Archive History
            job_doc["state"] = JobState.SUCCESS.value
            job_doc["started_at"] = start_time
            job_doc["completed_at"] = end_time
            job_doc["processing_time_ms"] = processing_time_ms
            await job_history_repo.create(job_doc)
            await jobs_repo.delete(job_id)
            
        except Exception as e:
            await self._handle_failure(job_doc, str(e))

    async def _handle_failure(self, job_doc: Dict[str, Any], error_msg: str):
        from modules.jobs.engines.retry_engine import retry_engine
        from modules.jobs.engines.dlq_engine import dlq_engine

        job_id = str(job_doc["_id"])
        retry_count = job_doc.get("retry_count", 0)

        logger.error(f"Job {job_id} failed: {error_msg}")

        if retry_engine.should_retry(retry_count):
            delay = retry_engine.calculate_backoff(retry_count)
            logger.info(f"Retrying job {job_id} in {delay} seconds (attempt {retry_count + 1})")

            # Update state to RETRYING
            job_doc["retry_count"] = retry_count + 1
            job_doc["state"] = JobState.RETRYING.value
            await jobs_repo.update(job_id, {
                "state": JobState.RETRYING.value,
                "retry_count": job_doc["retry_count"],
                "error": error_msg
            })

            # Requeue with delay
            async def requeue_after_delay():
                await asyncio.sleep(delay)
                # Reset to QUEUED before enqueue so claim_job works again
                await jobs_repo.update(job_id, {"state": JobState.QUEUED.value})
                job_doc["state"] = JobState.QUEUED.value
                await self.enqueue(job_doc)

            asyncio.create_task(requeue_after_delay())
        else:
            await dlq_engine.move_to_dlq(job_id, error_msg)

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

    async def shutdown(self):
        self._running = False
        for task in self._worker_tasks:
            task.cancel()
        await asyncio.gather(*self._worker_tasks, return_exceptions=True)
