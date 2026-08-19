import asyncio
import logging
from typing import Dict, Any

from modules.notifications.repository import notification_repo, preference_repo, failure_repo, audit_repo
from modules.notifications.constants import NotificationStatus
from modules.notifications.providers import get_provider
from modules.notifications.templates import template_engine

logger = logging.getLogger(__name__)


class NotificationDispatcher:
    def __init__(self):
        from core.config import settings
        self.max_retries = settings.MAX_JOB_RETRIES
        self.base_delay = settings.RETRY_DELAY_SECONDS

    async def process_job(self, job_data: Dict[str, Any]):
        """
        Worker function executed by the JobQueue.
        `job_data` contains the raw notification document inserted into DB.
        """
        notification_id = job_data["_id"]
        user_id = job_data["userSnapshot"]["userId"]
        channel = job_data["channel"]
        
        try:
            # 1. Fetch Preferences
            prefs = await preference_repo.get_preferences(user_id)
            
            # Check Opt-outs
            if channel == "PUSH" and not prefs.get("pushEnabled", True):
                await self._cancel_job(notification_id, "User has Push disabled")
                return
            if channel == "EMAIL" and not prefs.get("emailEnabled", True):
                await self._cancel_job(notification_id, "User has Email disabled")
                return
            if channel == "SMS" and not prefs.get("smsEnabled", True):
                await self._cancel_job(notification_id, "User has SMS disabled")
                return
                
            # TODO: Add Quiet Hours check here. If in quiet hours, 
            # requeue job with a scheduled delay.

            # 2. Render Template
            subject, body = await template_engine.render(
                job_data["templateId"], 
                channel, 
                prefs.get("language", "en"), 
                job_data["payload"]
            )
            
            # 3. Provider Selection
            provider = get_provider(channel)
            
            # 4. Dispatch with Exponential Backoff
            success = await self._send_with_retry(provider, user_id, subject, body, job_data, notification_id)
            
            if success:
                await notification_repo.update_status(notification_id, NotificationStatus.DELIVERED.value)
                await audit_repo.log({"notificationId": notification_id, "action": "DELIVERED", "provider": provider.provider_name})
            else:
                await self._fail_job(notification_id, "Max retries exhausted")

        except Exception as e:
            logger.error(f"Dispatcher critical error: {str(e)}")
            await self._fail_job(notification_id, str(e))


    async def _send_with_retry(self, provider, recipient, subject, body, payload, notification_id) -> bool:
        for attempt in range(1, self.max_retries + 1):
            try:
                await notification_repo.update_status(notification_id, NotificationStatus.SENDING.value)
                success, msg = await asyncio.wait_for(
                    provider.send(recipient, subject, body, payload),
                    timeout=5.0
                )
                if success:
                    return True
            except asyncio.TimeoutError:
                logger.warning(f"Delivery attempt {attempt} timed out for provider {provider.provider_name}")
            except Exception as e:
                logger.warning(f"Delivery attempt {attempt} failed: {str(e)}")
                
            if attempt < self.max_retries:
                delay = self.base_delay ** attempt
                await asyncio.sleep(delay)
                
        return False

    async def _cancel_job(self, notification_id: str, reason: str):
        await notification_repo.update_status(notification_id, NotificationStatus.CANCELLED.value, {"reason": reason})
        await audit_repo.log({"notificationId": notification_id, "action": "CANCELLED", "reason": reason})

    async def _fail_job(self, notification_id: str, reason: str):
        await notification_repo.update_status(notification_id, NotificationStatus.FAILED.value)
        await failure_repo.log({"notificationId": notification_id, "reason": reason})
        await audit_repo.log({"notificationId": notification_id, "action": "FAILED", "reason": reason})

dispatcher = NotificationDispatcher()
