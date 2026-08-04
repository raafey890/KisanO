from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.deps import get_current_user, require_role
from app.services.dashboard import get_farmer_dashboard_stats, get_owner_dashboard_stats, get_admin_dashboard_stats
from app.core.responses import standard_response

router = APIRouter(prefix="/api/dashboards", tags=["Dashboards"])

@router.get("/farmer")
def get_farmer_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["FARMER", "ADMIN"]))
):
    stats = get_farmer_dashboard_stats(db, current_user.id)
    return standard_response(
        success=True,
        message="Farmer dashboard stats retrieved successfully",
        data=stats
    )

@router.get("/owner")
def get_owner_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["EQUIPMENT_OWNER", "ADMIN"]))
):
    stats = get_owner_dashboard_stats(db, current_user.id)
    return standard_response(
        success=True,
        message="Owner dashboard stats retrieved successfully",
        data=stats
    )

@router.get("/admin")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["ADMIN"]))
):
    stats = get_admin_dashboard_stats(db)
    return standard_response(
        success=True,
        message="Admin dashboard stats retrieved successfully",
        data=stats
    )
