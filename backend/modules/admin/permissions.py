from typing import Callable, List
from fastapi import Request, HTTPException, status, Depends
from core.dependencies import get_current_user
from modules.admin.roles import get_role_permissions

def require_permission(required_permission: str):
    """Dependency to check if admin has specific permission."""
    async def permission_checker(current_user: dict = Depends(get_current_user)):
        role = current_user.get("role")
        permissions = get_role_permissions(role)
        
        if required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Requires {required_permission}"
            )
        return current_user
        
    return permission_checker
