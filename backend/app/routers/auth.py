from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, Token, UserResponse
from app.services.auth import register_user_service, authenticate_user_service
from app.core.responses import standard_response

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user_service(db, user_data)
    # Serialize response via Pydantic model
    response_data = UserResponse.from_orm(user)
    return standard_response(
        success=True,
        message="User registered successfully",
        data=response_data.dict(),
        status_code=201
    )

@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth_result = authenticate_user_service(db, form_data.username, form_data.password)
    
    # Structure auth_result user response
    user_response = UserResponse.from_orm(auth_result["user"])
    token_data = {
        "access_token": auth_result["access_token"],
        "token_type": auth_result["token_type"],
        "user": user_response.dict()
    }
    
    return standard_response(
        success=True,
        message="Login successful",
        data=token_data
    )
