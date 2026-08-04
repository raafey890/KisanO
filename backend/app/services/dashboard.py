from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.booking import Booking
from app.models.equipment import Equipment
from app.models.user import User
from app.models.marketplace import MarketplaceListing
from app.models.notification import Notification
from app.models.review import Review

def get_farmer_dashboard_stats(db: Session, farmer_id: int):
    # Active Bookings
    active = db.query(Booking).filter(
        Booking.farmerId == farmer_id,
        Booking.bookingStatus.in_(["Pending", "Approved"])
    ).all()

    # Completed Bookings
    completed = db.query(Booking).filter(
        Booking.farmerId == farmer_id,
        Booking.bookingStatus == "Completed"
    ).all()

    # Total Expenses
    total_expenses = db.query(func.sum(Booking.totalAmount)).filter(
        Booking.farmerId == farmer_id,
        Booking.bookingStatus == "Completed"
    ).scalar() or 0.0

    # Recent Notifications
    notifications = db.query(Notification).filter(
        Notification.userId == farmer_id
    ).order_by(Notification.id.desc()).limit(5).all()

    return {
        "activeBookingsCount": len(active),
        "completedBookingsCount": len(completed),
        "totalExpenses": total_expenses,
        "recentNotifications": notifications
    }

def get_owner_dashboard_stats(db: Session, owner_id: int):
    # Equipment Count
    equip_count = db.query(Equipment).filter(Equipment.ownerId == owner_id).count()

    # Active Bookings (Approved or Pending for this owner's equipment)
    active = db.query(Booking).filter(
        Booking.ownerId == owner_id,
        Booking.bookingStatus.in_(["Pending", "Approved"])
    ).all()

    # Monthly Earnings (Completed bookings sum)
    monthly_earnings = db.query(func.sum(Booking.totalAmount)).filter(
        Booking.ownerId == owner_id,
        Booking.bookingStatus == "Completed"
    ).scalar() or 0.0

    # Reviews and Ratings summary for owner's equipment
    equipment_ids = [eq.id for eq in db.query(Equipment).filter(Equipment.ownerId == owner_id).all()]
    rating_stats = {"avgRating": 5.0, "totalReviews": 0}
    if equipment_ids:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.equipmentId.in_(equipment_ids)).scalar()
        review_count = db.query(Review).filter(Review.equipmentId.in_(equipment_ids)).count()
        rating_stats = {
            "avgRating": float(avg_rating) if avg_rating else 5.0,
            "totalReviews": review_count
        }

    return {
        "equipmentCount": equip_count,
        "activeBookingsCount": len(active),
        "totalEarnings": monthly_earnings,
        "ratingStats": rating_stats
    }

def get_admin_dashboard_stats(db: Session):
    total_users = db.query(User).count()
    total_bookings = db.query(Booking).count()
    total_equipment = db.query(Equipment).count()
    total_listings = db.query(MarketplaceListing).count()

    # Simple analytics (e.g. total rental revenue)
    total_revenue = db.query(func.sum(Booking.totalAmount)).filter(Booking.bookingStatus == "Completed").scalar() or 0.0

    return {
        "totalUsers": total_users,
        "totalBookings": total_bookings,
        "totalEquipment": total_equipment,
        "totalMarketplaceListings": total_listings,
        "analytics": {
            "totalPlatformRevenue": total_revenue
        }
    }
