import logging
from typing import Dict, Any
import asyncio

logger = logging.getLogger(__name__)

async def process_scheduled_job(args: Dict[str, Any]):
    """
    Background worker to process scheduled jobs.
    """
    job_name = args.get("job_name")
    if not job_name:
        raise ValueError("job_name is required for scheduled job")
        
    logger.info(f"Processing scheduled job {job_name}")
    
    # Simulate processing
    await asyncio.sleep(1)
    
    logger.info(f"Completed scheduled job {job_name}")
