import logging
from typing import Dict, Any
from modules.shared.event_bus import global_event_bus
from modules.jobs.job_engine import job_engine
from modules.jobs.constants import JobPriority

logger = logging.getLogger(__name__)

async def handle_payment_succeeded(payload: Dict[str, Any]):
    logger.info("Scheduling post-payment workflows via JobEngine")
    await job_engine.enqueue(
        worker_name="send_payment_receipt",
        args={"payment_id": payload.get("payment_id")},
        priority=JobPriority.HIGH
    )
    
async def handle_report_requested(payload: Dict[str, Any]):
    logger.info("Scheduling background report generation")
    await job_engine.enqueue(
        worker_name="generate_report",
        args={"report_type": payload.get("type"), "user_id": payload.get("user_id")},
        priority=JobPriority.BACKGROUND
    )

def register_job_event_listeners():
    # Hooks back to other modules
    from modules.payments.events import PaymentDomainEvents
    global_event_bus.subscribe(PaymentDomainEvents.PAYMENT_SUCCEEDED, handle_payment_succeeded)
    
    from modules.analytics.events import AnalyticsDomainEvents
    global_event_bus.subscribe(AnalyticsDomainEvents.REPORT_REQUESTED, handle_report_requested)
