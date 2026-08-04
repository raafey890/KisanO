from typing import List, Dict
from core.exceptions import UnauthorizedException
import logging

logger = logging.getLogger(__name__)

class RBACEngine:
    """
    Centralized Role-Based Access Control matrix.
    """
    def __init__(self):
        # MVP In-memory matrix. In an enterprise system, this loads from MongoDB/PolicyEngine.
        self.role_permissions: Dict[str, List[str]] = {
            "USER": ["read:own_profile", "write:own_profile", "book:equipment"],
            "FARMER": ["read:own_profile", "write:own_profile", "book:equipment", "create:listing"],
            "OWNER": ["read:own_profile", "write:own_profile", "create:equipment", "manage:own_bookings"],
            "ADMIN": ["read:all", "write:all", "manage:users", "manage:equipment"],
            "SUPER_ADMIN": ["read:all", "write:all", "manage:all", "manage:security"]
        }

    def has_permission(self, role: str, required_permission: str) -> bool:
        if role == "SUPER_ADMIN":
            return True
            
        perms = self.role_permissions.get(role, [])
        if required_permission in perms or "write:all" in perms:
            return True
            
        logger.warning(f"RBAC Violation: Role '{role}' attempted to access '{required_permission}'")
        return False

rbac_engine = RBACEngine()
