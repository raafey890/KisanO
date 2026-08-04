from typing import Dict, Any, Optional
from modules.admin.schemas import BroadcastCommandPayload, ActionType
from modules.admin.engines.audit_engine import audit_engine
from modules.admin.repository import broadcast_repo

class BroadcastEngine:
    @staticmethod
    async def create_broadcast(actor_id: str, actor_role: str, payload: BroadcastCommandPayload, ip_address: Optional[str] = None):
        """
        Creates a broadcast record and relies on the Notification Module 
        (via EventBus) to actually dispatch the messages.
        """
        doc = {
            "title": payload.title,
            "body": payload.body,
            "targetRoles": payload.targetRoles,
            "targetRegions": payload.targetRegions,
            "authorId": actor_id
        }
        
        await broadcast_repo.log(doc)
        
        await audit_engine.log_action(
            actor_id=actor_id,
            actor_role=actor_role,
            action=ActionType.BROADCAST,
            new_value={"title": payload.title},
            ip_address=ip_address
        )
        
        # We will publish AdminBroadcastCreated via the Unified Engine's event hooks

broadcast_engine = BroadcastEngine()
