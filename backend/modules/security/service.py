from typing import List, Dict, Any
from modules.security.repository import security_audit_repo
from modules.security.rbac import rbac_engine
from modules.security.policy_engine import policy_engine

class SecurityService:
    @staticmethod
    async def get_audit_logs(skip: int, limit: int) -> tuple[List[Dict[str, Any]], int]:
        cursor = security_audit_repo.collection.find().sort("timestamp", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        for i in items: i["id"] = str(i["_id"])
        total = await security_audit_repo.collection.count_documents({})
        return items, total

    @staticmethod
    def get_security_status() -> Dict[str, Any]:
        return {
            "rbac_roles_loaded": len(rbac_engine.role_permissions.keys()),
            "policies": {
                "password_min_length": policy_engine.password_min_length,
                "password_require_special": policy_engine.password_require_special,
                "lockout_minutes": policy_engine.lockout_minutes
            }
        }
