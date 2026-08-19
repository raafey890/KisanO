import logging
from typing import Dict, Any
from modules.notifications.dispatcher import dispatcher

logger = logging.getLogger(__name__)

async def process_notification(args: Dict[str, Any]):
    """
    Background worker to process notifications via the dispatcher.
    """
    notif_doc = args.get("notif_doc")
    if not notif_doc:
        raise ValueError("notif_doc is required for notification processing")
        
    await dispatcher.process_job(notif_doc)
