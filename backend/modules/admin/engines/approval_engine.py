from typing import Dict, Any, Optional
from core.exceptions import AppException
from modules.admin.schemas import ApprovalCommandPayload
from modules.admin.facades import platform_write_facade
from modules.admin.engines.audit_engine import audit_engine
from modules.admin.constants import ActionType

class ApprovalEngine:
    @staticmethod
    async def process_approval(
        actor_id: str, 
        actor_role: str, 
        payload: ApprovalCommandPayload, 
        ip_address: Optional[str] = None
    ) -> bool:
        """
        Executes an approval workflow via the PlatformWriteFacade.
        """
        command_name = f"APPROVE_{payload.resourceType.value}"
        
        try:
            # 1. Execute Command in Business Module
            await platform_write_facade.execute_command(command_name, {
                "resourceId": payload.resourceId,
                "approve": payload.approve,
                "reason": payload.reason
            })
            
            # 2. Audit
            action = ActionType.APPROVE if payload.approve else ActionType.REJECT
            await audit_engine.log_action(
                actor_id=actor_id,
                actor_role=actor_role,
                action=action,
                resource_type=payload.resourceType,
                resource_id=payload.resourceId,
                reason=payload.reason,
                ip_address=ip_address
            )
            return True
            
        except NotImplementedError:
            raise AppException(f"Module for {payload.resourceType.value} has not registered an approval command.", 501)
        except Exception as e:
            raise AppException(f"Approval failed: {str(e)}", 400)

approval_engine = ApprovalEngine()
