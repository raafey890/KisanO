import asyncio
import logging
import signal
from core.config import settings
from db.mongodb import db_manager
from modules.jobs.engines.worker_engine import worker_engine

# Need to import modules that register jobs
import modules.jobs.events 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker_runner")

async def startup():
    logger.info("Starting Background Worker Node...")
    await db_manager.connect()
    
    # In a real Celery/RQ setup, this starts the consumer.
    # For our AsyncJobProvider MVP, we start the internal loop.
    await worker_engine.start_workers(num_workers=5)

async def shutdown():
    logger.info("Shutting down Worker Node...")
    await db_manager.disconnect()

def handle_sigint(signum, frame):
    logger.info("Received termination signal.")
    # Graceful shutdown logic would go here
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
