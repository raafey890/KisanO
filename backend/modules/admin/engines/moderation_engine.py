from typing import Dict, Any, Optional
from core.exceptions import AppException
from modules.admin.facades import platform_write_facade
from modules.admin.engines.audit_engine import audit_engine
from modules.admin.constants import ActionType, ResourceType

class ModerationEngine:
    @staticmethod
    async def process_moderation(
        actor_id: str, 
        actor_role: str, 
        resource_id: str, 
        resource_type: ResourceType, 
        action: str, 
        reason: str,
        ip_address: Optional[str] = None
    ) -> bool:
        command_name = f"MODERATE_{resource_type.value}"
        try:
            # 1. Execute Command in Business Module
            await platform_write_facade.execute_command(command_name, {
                "resourceId": resource_id,
                "action": action, # e.g. "HIDE", "DELETE", "FLAG"
                "reason": reason
            })
            
            # 2. Audit
            await audit_engine.log_action(
                actor_id=actor_id,
                actor_role=actor_role,
                action=ActionType.MODERATE,
                resource_type=resource_type,
                resource_id=resource_id,
                reason=reason,
                ip_address=ip_address
            )
            return True
            
        except NotImplementedError:
            raise AppException(f"Module for {resource_type.value} has not registered a moderation command.", 501)

moderation_engine = ModerationEngine()
