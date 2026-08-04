from fastapi import Depends, HTTPException, status
from typing import List, Dict, Any, Callable
from jose import JWTError, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings
from modules.auth.repository import user_repository, session_repository

security = HTTPBearer()

async def get_current_user_and_session(credentials: HTTPAuthorizationCredentials = Depends(security)) -> tuple[Dict[str, Any], str]:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        session_id: str = payload.get("session_id")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "access" or session_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    user = await user_repository.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    if user.get("status") == "SUSPENDED":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account suspended")
        
    if user.get("status") == "LOCKED":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is temporarily locked")

    # Validate that session is still active
    session = await session_repository.get_by_id(session_id)
    if not session or not session.get("isActive"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or revoked")

    return user, session_id

async def get_current_user(data: tuple[Dict[str, Any], str] = Depends(get_current_user_and_session)) -> Dict[str, Any]:
    return data[0]

def RequireRole(roles: List[str]) -> Callable:
    async def role_checker(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        if user.get("role") not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role privileges")
        return user
    return role_checker

def RequirePermission(permission: str) -> Callable:
    # Future ready: we would check a permissions array on the user or role document
    async def permission_checker(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        # Implementation placeholder
        # if permission not in user.get("permissions", []):
        #    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user
    return permission_checker
