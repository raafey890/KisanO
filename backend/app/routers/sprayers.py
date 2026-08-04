from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.database import get_db
from app.routers.deps import get_current_user
from app.models.sprayer import SprayerProfile
from app.schemas.sprayer import SprayerProfileCreate, SprayerProfileResponse
from app.core.responses import standard_response
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/api/sprayers", tags=["Sprayers"])

@router.get("")
def get_sprayers(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    sprayers = db.query(SprayerProfile).order_by(SprayerProfile.id.desc()).offset(skip).limit(limit).all()
    
    results = []
    for sp in sprayers:
        results.append({
            "id": sp.id,
            "userId": sp.userId,
            "experienceYears": sp.experienceYears,
            "equipmentType": sp.equipmentType,
            "dailyCapacityAcres": sp.dailyCapacityAcres,
            "ratePerAcre": sp.ratePerAcre,
            "availableAreas": json.loads(sp.availableAreas) if sp.availableAreas else [],
            "rating": sp.rating,
            "isVerified": sp.isVerified
        })
        
    return standard_response(
        success=True,
        message="Sprayers retrieved successfully",
        data={
            "page": page,
            "limit": limit,
            "items": results
        }
    )

@router.post("", status_code=status.HTTP_201_CREATED)
def create_sprayer_profile(
    payload: SprayerProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Check if profile already exists
    existing = db.query(SprayerProfile).filter(SprayerProfile.userId == current_user.id).first()
    if existing:
        # Update existing profile
        existing.experienceYears = payload.experienceYears
        existing.equipmentType = payload.equipmentType
        existing.dailyCapacityAcres = payload.dailyCapacityAcres
        existing.ratePerAcre = payload.ratePerAcre
        existing.availableAreas = json.dumps(payload.availableAreas)
        db_profile = existing
    else:
        # Create new profile
        db_profile = SprayerProfile(
            userId=current_user.id,
            experienceYears=payload.experienceYears,
            equipmentType=payload.equipmentType,
            dailyCapacityAcres=payload.dailyCapacityAcres,
            ratePerAcre=payload.ratePerAcre,
            availableAreas=json.dumps(payload.availableAreas)
        )
        db.add(db_profile)
        
    db.commit()
    db.refresh(db_profile)
    
    response_data = {
        "id": db_profile.id,
        "userId": db_profile.userId,
        "experienceYears": db_profile.experienceYears,
        "equipmentType": db_profile.equipmentType,
        "dailyCapacityAcres": db_profile.dailyCapacityAcres,
        "ratePerAcre": db_profile.ratePerAcre,
        "availableAreas": json.loads(db_profile.availableAreas) if db_profile.availableAreas else [],
        "rating": db_profile.rating,
        "isVerified": db_profile.isVerified
    }
    return standard_response(
        success=True,
        message="Sprayer profile saved successfully",
        data=response_data,
        status_code=201
    )
