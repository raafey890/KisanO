from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import timedelta
from app.crud.user import get_user_by_mobile, create_user, create_activity_log
from app.schemas.user import UserCreate, Token
from app.security import verify_password, create_access_token
from app.core.exceptions import KisanOException, CredentialException

def register_user_service(db: Session, user_data: UserCreate):
    # Check if mobile already exists
    existing = get_user_by_mobile(db, user_data.mobileNumber)
    if existing:
        raise KisanOException("Mobile number is already registered", status_code=400)
    
    # Create the user
    new_user = create_user(db, user_data)
    create_activity_log(db, new_user.id, "USER_REGISTRATION", f"Registered with role {new_user.role}")
    return new_user

def authenticate_user_service(db: Session, username: str, password: str) -> Token:
    # FastAPI OAuth2 form uses 'username' parameter; we bind it to 'mobileNumber'
    user = get_user_by_mobile(db, username)
    if not user:
        raise CredentialException("Mobile number not found")
        
    if user.isBlocked:
        raise KisanOException("Your account is blocked. Contact support.", status_code=403)
        
    if not verify_password(password, user.password_hash):
        raise CredentialException("Incorrect password")
        
    # Generate token
    token_data = {"sub": str(user.id), "role": user.role}
    access_token = create_access_token(data=token_data)
    
    # Log activity
    create_activity_log(db, user.id, "USER_LOGIN", "Logged in successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
