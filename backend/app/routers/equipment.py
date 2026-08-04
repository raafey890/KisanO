from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.routers.deps import get_current_user, require_role
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentResponse
from app.crud.equipment import list_equipments, get_equipment_by_id, create_equipment, update_equipment
from app.core.responses import standard_response
from app.core.exceptions import NotFoundException
import json

router = APIRouter(prefix="/api/equipment", tags=["Equipment"])

@router.get("")
def get_all_equipment(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    district: Optional[str] = None,
    village: Optional[str] = None,
    eq_type: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    sortBy: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    equipments = list_equipments(
        db=db,
        skip=skip,
        limit=limit,
        district=district,
        village=village,
        eq_type=eq_type,
        category=category,
        min_price=min_price,
        max_price=max_price,
        status=status,
        search_q=search,
        sort_by=sortBy
    )
    
    # Format JSON images array to python lists for Pydantic serialization
    results = []
    for eq in equipments:
        eq_dict = {
            "id": eq.id,
            "ownerId": eq.ownerId,
            "equipmentName": eq.equipmentName,
            "equipmentType": eq.equipmentType,
            "description": eq.description,
            "hourlyRate": eq.hourlyRate,
            "dailyRate": eq.dailyRate,
            "category": eq.category,
            "brand": eq.brand,
            "model": eq.model,
            "manufacturingYear": eq.manufacturingYear,
            "fuelType": eq.fuelType,
            "latitude": eq.latitude,
            "longitude": eq.longitude,
            "equipmentStatus": eq.equipmentStatus,
            "images": json.loads(eq.images) if eq.images else []
        }
        results.append(eq_dict)
        
    return standard_response(
        success=True,
        message="Equipment retrieved successfully",
        data={
            "page": page,
            "limit": limit,
            "items": results
        }
    )

@router.get("/{equipment_id}")
def get_equipment_detail(equipment_id: int, db: Session = Depends(get_db)):
    eq = get_equipment_by_id(db, equipment_id)
    if not eq:
        raise NotFoundException("Equipment not found")
        
    eq_data = {
        "id": eq.id,
        "ownerId": eq.ownerId,
        "equipmentName": eq.equipmentName,
        "equipmentType": eq.equipmentType,
        "description": eq.description,
        "hourlyRate": eq.hourlyRate,
        "dailyRate": eq.dailyRate,
        "category": eq.category,
        "brand": eq.brand,
        "model": eq.model,
        "manufacturingYear": eq.manufacturingYear,
        "fuelType": eq.fuelType,
        "latitude": eq.latitude,
        "longitude": eq.longitude,
        "equipmentStatus": eq.equipmentStatus,
        "images": json.loads(eq.images) if eq.images else []
    }
    return standard_response(
        success=True,
        message="Equipment details retrieved successfully",
        data=eq_data
    )

@router.post("", status_code=status.HTTP_201_CREATED)
def add_new_equipment(
    eq_data: EquipmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["ADMIN", "EQUIPMENT_OWNER"]))
):
    eq = create_equipment(db, eq_data, owner_id=current_user.id)
    eq_response = {
        "id": eq.id,
        "ownerId": eq.ownerId,
        "equipmentName": eq.equipmentName,
        "equipmentType": eq.equipmentType,
        "description": eq.description,
        "hourlyRate": eq.hourlyRate,
        "dailyRate": eq.dailyRate,
        "category": eq.category,
        "brand": eq.brand,
        "model": eq.model,
        "manufacturingYear": eq.manufacturingYear,
        "fuelType": eq.fuelType,
        "latitude": eq.latitude,
        "longitude": eq.longitude,
        "equipmentStatus": eq.equipmentStatus,
        "images": json.loads(eq.images) if eq.images else []
    }
    return standard_response(
        success=True,
        message="Equipment listed successfully",
        data=eq_response,
        status_code=201
    )
