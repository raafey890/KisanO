from sqlalchemy.orm import Session
from app.models.marketplace import MarketplaceListing
from app.schemas.marketplace import MarketplaceCreate, MarketplaceUpdate

def get_listing_by_id(db: Session, listing_id: int):
    return db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id).first()

def list_marketplace(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    district: str = None,
    village: str = None,
    status: str = "Active"
):
    query = db.query(MarketplaceListing)
    if status:
        query = query.filter(MarketplaceListing.listingStatus == status)
    if district:
        query = query.filter(MarketplaceListing.district.ilike(f"%{district}%"))
    if village:
        query = query.filter(MarketplaceListing.village.ilike(f"%{village}%"))
        
    return query.order_by(MarketplaceListing.id.desc()).offset(skip).limit(limit).all()

def create_marketplace_listing(db: Session, listing: MarketplaceCreate, seller_id: int):
    db_listing = MarketplaceListing(
        sellerId=seller_id,
        cropName=listing.cropName,
        quantity=listing.quantity,
        price=listing.price,
        village=listing.village,
        district=listing.district,
        state=listing.state,
        contactPhone=listing.contactPhone
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_marketplace_listing(db: Session, listing_id: int, update: MarketplaceUpdate):
    db_listing = get_listing_by_id(db, listing_id)
    if not db_listing:
        return None
        
    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_listing, key, value)
        
    db.commit()
    db.refresh(db_listing)
    return db_listing
