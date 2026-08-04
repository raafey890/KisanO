import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any, Callable, Coroutine
import logging

logger = logging.getLogger(__name__)

class BaseNotificationQueue(ABC):
    @abstractmethod
    async def enqueue(self, job_data: Dict[str, Any]) -> None:
        pass

    @abstractmethod
    def set_worker(self, worker_func: Callable[[Dict[str, Any]], Coroutine[Any, Any, None]]) -> None:
        pass


class InMemoryQueue(BaseNotificationQueue):
    """
    Mock implementation using asyncio. 
    In production, this is swapped with a Celery/RabbitMQ implementation.
    """
    def __init__(self):
        self._queue = asyncio.Queue()
        self._worker_func = None
        self._task = None

    def set_worker(self, worker_func: Callable[[Dict[str, Any]], Coroutine[Any, Any, None]]) -> None:
        self._worker_func = worker_func
        # Start the background worker loop
        if not self._task:
            self._task = asyncio.create_task(self._process_queue())

    async def enqueue(self, job_data: Dict[str, Any]) -> None:
        await self._queue.put(job_data)

    async def _process_queue(self):
        while True:
            try:
                job_data = await self._queue.get()
                if self._worker_func:
                    # In a real broker, this would have ACK/NACK mechanics
                    await self._worker_func(job_data)
                self._queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error processing job in InMemoryQueue: {str(e)}")

# Global Singleton
notification_queue = InMemoryQueue()
