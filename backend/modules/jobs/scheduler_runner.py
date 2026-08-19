import asyncio
import logging
import signal
import sys
from db.mongodb import db_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("scheduler_runner")

async def main():
    logger.info("Starting Scheduler Node...")
    await db_manager.connect()
    
    # In a real Celery/RQ setup, this starts celery beat.
    # For MVP, we simulate a scheduler loop
    stop_event = asyncio.Event()

    def handle_sigint():
        logger.info("Received termination signal.")
        stop_event.set()

    if sys.platform != "win32":
        loop = asyncio.get_running_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(sig, handle_sigint)

    # Simple scheduler loop simulation
    async def run_scheduler():
        from modules.jobs.engines.scheduler_engine import scheduler_engine
        while not stop_event.is_set():
            logger.info("Scheduler checking for due jobs...")
            await scheduler_engine.check_crons()
            await asyncio.sleep(60) # check every minute

    scheduler_task = asyncio.create_task(run_scheduler())

    try:
        await stop_event.wait()
    except KeyboardInterrupt:
        logger.info("Received KeyboardInterrupt.")
    finally:
        logger.info("Shutting down Scheduler Node...")
        scheduler_task.cancel()
        await db_manager.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
