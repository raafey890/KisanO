from typing import Dict, Any, List

class SecurityEngine:
    @staticmethod
    def validate_permission(user_role: str, required_permission: str) -> bool:
        # MVP: simple role check. Future: check granular permissions
        if user_role == "SUPER_ADMIN": return True
        # For now, just allow if Admin
        return user_role == "ADMIN"

security_engine = SecurityEngine()
