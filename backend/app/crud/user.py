from sqlalchemy.orm import Session
from app.models.user import User, ActivityLog
from app.schemas.user import UserCreate, UserUpdate
from app.security import get_password_hash

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_mobile(db: Session, mobile: str):
    return db.query(User).filter(User.mobileNumber == mobile).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        fullName=user.fullName,
        mobileNumber=user.mobileNumber,
        email=user.email,
        password_hash=get_password_hash(user.password),
        role=user.role,
        village=user.village,
        district=user.district,
        state=user.state
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

def create_activity_log(db: Session, user_id: int, action: str, details: str = None):
    log = ActivityLog(userId=user_id, action=action, details=details)
    db.add(log)
    db.commit()
    return log
