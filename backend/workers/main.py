import asyncio
import logging
from core.config import settings
from db.mongodb import db_manager
from core.redis_client import redis_manager
from modules.notifications.service import NotificationService
from modules.jobs.service import JobService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

async def process_jobs():
    """Continuously poll for jobs and process them with graceful shutdown, heartbeat, and DLQ."""
    while True:
        try:
            # Heartbeat to Redis
            if redis_manager.redis:
                await redis_manager.redis.setex("worker:heartbeat", 60, "alive")
                
            # Process generic jobs
            from modules.jobs.job_engine import job_engine
            await job_engine.process_pending_jobs()
            
            # Process notification queue
            await NotificationService.process_queue()
            
        except Exception as e:
            logger.error(f"Worker iteration error: {e}")
            
        await asyncio.sleep(5)

async def main():
    logger.info("Starting standalone background worker...")
    await db_manager.connect()
    await redis_manager.connect()
    
    try:
        await process_jobs()
    except asyncio.CancelledError:
        logger.info("Worker gracefully shutting down...")
    finally:
        await redis_manager.disconnect()
        await db_manager.disconnect()
        logger.info("Worker shutdown complete.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
