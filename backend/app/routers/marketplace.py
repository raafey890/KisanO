from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import json
from app.database import get_db
from app.routers.deps import get_current_user
from app.schemas.marketplace import MarketplaceCreate, MarketplaceUpdate, MarketplaceResponse
from app.crud.marketplace import list_marketplace, create_marketplace_listing, get_listing_by_id, update_marketplace_listing
from app.core.responses import standard_response
from app.core.exceptions import NotFoundException, ForbiddenException

router = APIRouter(prefix="/api/naruu", tags=["Naruu Seedling Marketplace"])

@router.get("")
def get_naruu_listings(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    district: Optional[str] = None,
    village: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    listings = list_marketplace(db=db, skip=skip, limit=limit, district=district, village=village)
    
    results = []
    for lst in listings:
        results.append({
            "id": lst.id,
            "sellerId": lst.sellerId,
            "cropName": lst.cropName,
            "quantity": lst.quantity,
            "price": lst.price,
            "village": lst.village,
            "district": lst.district,
            "state": lst.state,
            "contactPhone": lst.contactPhone,
            "images": json.loads(lst.images) if lst.images else [],
            "listingStatus": lst.listingStatus,
            "createdAt": lst.createdAt
        })
        
    return standard_response(
        success=True,
        message="Marketplace seedling listings retrieved successfully",
        data={
            "page": page,
            "limit": limit,
            "items": results
        }
    )

@router.post("", status_code=status.HTTP_201_CREATED)
def list_excess_seedlings(
    listing_data: MarketplaceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    listing = create_marketplace_listing(db, listing_data, seller_id=current_user.id)
    response_data = {
        "id": listing.id,
        "sellerId": listing.sellerId,
        "cropName": listing.cropName,
        "quantity": listing.quantity,
        "price": listing.price,
        "village": listing.village,
        "district": listing.district,
        "state": listing.state,
        "contactPhone": listing.contactPhone,
        "images": json.loads(listing.images) if listing.images else [],
        "listingStatus": listing.listingStatus,
        "createdAt": listing.createdAt
    }
    return standard_response(
        success=True,
        message="Seedlings listed successfully",
        data=response_data,
        status_code=201
    )

@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    listing = get_listing_by_id(db, listing_id)
    if not listing:
        raise NotFoundException("Listing not found")
        
    # Check permissions (only seller or ADMIN can delete)
    if listing.sellerId != current_user.id and current_user.role != "ADMIN":
        raise ForbiddenException("You do not have permission to delete this listing")
        
    # Update status to Sold/Removed instead of hard deleting (or delete directly)
    update_marketplace_listing(db, listing_id, MarketplaceUpdate(listingStatus="Sold"))
    
    return standard_response(
        success=True,
        message="Seedling listing marked as sold/removed"
    )
