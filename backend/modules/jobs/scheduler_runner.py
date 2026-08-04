import asyncio
import logging
import signal
from core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("scheduler_runner")

async def startup():
    logger.info("Starting Scheduler Node...")
    # In a real Celery/RQ setup, this starts celery beat.
    # For MVP, this might loop and check cron configurations.

async def shutdown():
    logger.info("Shutting down Scheduler Node...")

def handle_sigint(signum, frame):
    logger.info("Received termination signal.")
    exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, handle_sigint)
    signal.signal(signal.SIGTERM, handle_sigint)
    
    loop = asyncio.get_event_loop()
    loop.run_until_complete(startup())
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        loop.run_until_complete(shutdown())
        loop.close()
