from sqlalchemy.orm import Session
from sqlalchemy import or_
import json
from app.models.equipment import Equipment
from app.models.user import User
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate

def get_equipment_by_id(db: Session, eq_id: int):
    return db.query(Equipment).filter(Equipment.id == eq_id).first()

def list_equipments(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    district: str = None,
    village: str = None,
    eq_type: str = None,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    status: str = None,
    search_q: str = None,
    sort_by: str = None
):
    query = db.query(Equipment).join(User, Equipment.ownerId == User.id)

    # Filtering
    if district:
        query = query.filter(User.district.ilike(f"%{district}%"))
    if village:
        query = query.filter(User.village.ilike(f"%{village}%"))
    if eq_type:
        query = query.filter(Equipment.equipmentType == eq_type)
    if category:
        query = query.filter(Equipment.category == category)
    if min_price is not None:
        query = query.filter(Equipment.hourlyRate >= min_price)
    if max_price is not None:
        query = query.filter(Equipment.hourlyRate <= max_price)
    if status:
        query = query.filter(Equipment.equipmentStatus == status)
    if search_q:
        query = query.filter(
            or_(
                Equipment.equipmentName.ilike(f"%{search_q}%"),
                Equipment.description.ilike(f"%{search_q}%")
            )
        )

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Equipment.hourlyRate.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Equipment.hourlyRate.desc())
    elif sort_by == "newest":
        query = query.order_by(Equipment.id.desc())
    else:
        query = query.order_by(Equipment.id.desc())  # Default sort

    return query.offset(skip).limit(limit).all()

def create_equipment(db: Session, eq: EquipmentCreate, owner_id: int):
    db_eq = Equipment(
        ownerId=owner_id,
        equipmentName=eq.equipmentName,
        equipmentType=eq.equipmentType,
        description=eq.description,
        hourlyRate=eq.hourlyRate,
        dailyRate=eq.dailyRate,
        category=eq.category,
        brand=eq.brand,
        model=eq.model,
        manufacturingYear=eq.manufacturingYear,
        fuelType=eq.fuelType,
        latitude=eq.latitude,
        longitude=eq.longitude
    )
    db.add(db_eq)
    db.commit()
    db.refresh(db_eq)
    return db_eq

def update_equipment(db: Session, eq_id: int, eq_update: EquipmentUpdate):
    db_eq = get_equipment_by_id(db, eq_id)
    if not db_eq:
        return None
    
    update_data = eq_update.dict(exclude_unset=True)
    if "images" in update_data:
        update_data["images"] = json.dumps(update_data["images"])
        
    for key, value in update_data.items():
        setattr(db_eq, key, value)
        
    db.commit()
    db.refresh(db_eq)
    return db_eq
