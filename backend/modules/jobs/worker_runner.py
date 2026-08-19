import asyncio
import logging
import signal
from core.config import settings
from db.mongodb import db_manager
from modules.jobs.engines.worker_engine import worker_engine

# Need to import modules that register jobs
import modules.jobs.events  # noqa: F401

from modules.jobs.workers.ai_doctor_worker import process_ai_diagnosis
from modules.jobs.workers.scheduler_worker import process_scheduled_job
from modules.notifications.worker import process_notification

import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker_runner")


async def main():
    logger.info("Starting Background Worker Node...")
    await db_manager.connect()
    
    # Register workers
    worker_engine.provider.register_worker("process_ai_diagnosis", process_ai_diagnosis)
    worker_engine.provider.register_worker("process_scheduled_job", process_scheduled_job)
    worker_engine.provider.register_worker("notification_worker", process_notification)
    
    await worker_engine.start_workers(num_workers=settings.BACKGROUND_WORKERS_COUNT)

    stop_event = asyncio.Event()

    def handle_sigint():
        logger.info("Received termination signal.")
        stop_event.set()

    if sys.platform != "win32":
        loop = asyncio.get_running_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(sig, handle_sigint)

    try:
        await stop_event.wait()
    except KeyboardInterrupt:
        logger.info("Received KeyboardInterrupt.")
    finally:
        logger.info("Shutting down Worker Node...")
        await worker_engine.provider.shutdown()
        await db_manager.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
