from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from core.config import settings
from core.exceptions import UnauthorizedException, ForbiddenException
from modules.auth.repository import user_repository
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Validate JWT and fetch current user from database."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException(message="Could not validate credentials")
        
        # Check token type
        if payload.get("type") != "access":
            raise UnauthorizedException(message="Invalid token type. Access token required.")
            
    except JWTError:
        raise UnauthorizedException(message="Could not validate credentials")

    user = await user_repository.get_by_id(user_id)
    if user is None:
        raise UnauthorizedException(message="User not found")
    
    # Comprehensive status handling
    status = user.get("status", "ACTIVE")
    if status == "SUSPENDED":
        raise ForbiddenException(message="Account suspended. Please contact support.")
    elif status == "INACTIVE":
        raise ForbiddenException(message="Account inactive.")
    elif status == "REJECTED":
        raise ForbiddenException(message="Account verification rejected.")

    return user

class RequireRole:
    """Dependency injection class to enforce RBAC."""
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, current_user = Depends(get_current_user)):
        if current_user.get("role") not in self.allowed_roles:
            raise ForbiddenException(message="You do not have permission to perform this action.")
        return current_user
