import asyncio
import logging
from datetime import datetime, timezone
from passlib.context import CryptContext
from core.config import settings
from db.mongodb import db_manager, get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)

async def seed_database():
    await db_manager.connect()
    db = get_db()
    
    # 1. Seed Users
    hashed_password = pwd_context.hash("Admin@123")
    
    super_admin = {
        "phone": "+919999999999",
        "email": "admin@kisano.com",
        "fullName": "Super Admin",
        "role": "SUPER_ADMIN",
        "status": "ACTIVE",
        "isPhoneVerified": True,
        "isEmailVerified": True,
        "hashedPassword": hashed_password,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    farmer = {
        "phone": "+918888888888",
        "email": "farmer@kisano.com",
        "fullName": "Kisan Bhai",
        "role": "FARMER",
        "status": "ACTIVE",
        "isPhoneVerified": True,
        "isEmailVerified": True,
        "hashedPassword": pwd_context.hash("Farmer@123"),
        "profile": {
            "completionPercentage": 80,
            "kycStatus": "VERIFIED"
        },
        "farms": [{
            "id": "farm_1",
            "name": "Primary Farm",
            "sizeAcres": 10.5,
            "cropTypes": ["Wheat", "Soybean"],
            "location": {
                "type": "Point",
                "coordinates": [77.2090, 28.6139] # New Delhi
            }
        }],
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    owner = {
        "phone": "+917777777777",
        "email": "owner@kisano.com",
        "fullName": "Equipment Owner",
        "role": "EQUIPMENT_OWNER",
        "status": "ACTIVE",
        "isPhoneVerified": True,
        "isEmailVerified": True,
        "hashedPassword": pwd_context.hash("Owner@123"),
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    # Clear old users for testing
    await db.users.delete_many({"email": {"$in": ["admin@kisano.com", "farmer@kisano.com", "owner@kisano.com"]}})
    
    res = await db.users.insert_many([super_admin, farmer, owner])
    owner_id = res.inserted_ids[2]
    
    # 2. Seed Equipment
    equipment = {
        "equipmentName": "Mahindra 575 DI Tractor",
        "category": "Tractors",
        "brand": "Mahindra",
        "model": "575 DI",
        "description": "Powerful tractor suitable for heavy plowing and transport.",
        "pricing": {
            "dailyRate": 1500.0,
            "hourlyRate": 200.0
        },
        "location": {
            "type": "Point",
            "coordinates": [77.2090, 28.6139]
        },
        "ownerSnapshot": {
            "ownerId": str(owner_id),
            "ownerName": "Equipment Owner"
        },
        "status": "ACTIVE",
        "analytics": {
            "views": 0, "bookings": 0, "revenue": 0.0,
            "averageRating": 4.5, "reviewCount": 2, "lastBookingDate": None
        },
        "isDeleted": False,
        "version": 1,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    await db.equipment.delete_many({"equipmentName": "Mahindra 575 DI Tractor"})
    await db.equipment.insert_one(equipment)
    
    # 3. Seed Marketplace Products
    product = {
        "name": "Urea Fertilizer 50kg",
        "category": "Fertilizers",
        "brand": "IFFCO",
        "price": 266.50,
        "stockQuantity": 1000,
        "description": "High quality nitrogen fertilizer for rapid growth.",
        "isActive": True,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    await db.marketplace_products.delete_many({"name": "Urea Fertilizer 50kg"})
    await db.marketplace_products.insert_one(product)
    
    logger.info("Database seeded successfully with initial test data.")
    print("Database seeded successfully.")
    await db_manager.disconnect()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed_database())
