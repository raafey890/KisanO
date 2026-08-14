import asyncio
import logging
import pymongo
from core.config import settings
from db.mongodb import db_manager, get_db

logger = logging.getLogger(__name__)

async def setup_indexes():
    await db_manager.connect()
    db = get_db()
    
    logger.info("Setting up database indexes...")
    
    # 1. Users Collection
    # Unique constraint on email and phone
    await db.users.create_index([("email", pymongo.ASCENDING)], unique=True, sparse=True)
    await db.users.create_index([("phone", pymongo.ASCENDING)], unique=True)
    # Search index
    await db.users.create_index([("fullName", pymongo.TEXT), ("email", pymongo.TEXT)])
    
    # 2. Equipment Collection
    # Text index for search
    await db.equipment.create_index([
        ("equipmentName", pymongo.TEXT),
        ("brand", pymongo.TEXT),
        ("model", pymongo.TEXT),
        ("category", pymongo.TEXT)
    ])
    # Geospatial index for location-based search
    await db.equipment.create_index([("location.coordinates", pymongo.GEOSPHERE)])
    # Standard indexes
    await db.equipment.create_index([("ownerSnapshot.ownerId", pymongo.ASCENDING)])
    await db.equipment.create_index([("status", pymongo.ASCENDING)])
    
    # 3. Marketplace Products Collection
    await db.marketplace_products.create_index([
        ("name", pymongo.TEXT),
        ("brand", pymongo.TEXT),
        ("category", pymongo.TEXT)
    ])
    await db.marketplace_products.create_index([("isActive", pymongo.ASCENDING)])
    
    # 4. Bookings Collection
    await db.equipment_bookings.create_index([("farmerId", pymongo.ASCENDING)])
    await db.equipment_bookings.create_index([("equipmentId", pymongo.ASCENDING)])
    await db.equipment_bookings.create_index([("status", pymongo.ASCENDING)])
    
    # 5. Auth Sessions Collection
    await db.auth_sessions.create_index([("userId", pymongo.ASCENDING)])
    await db.auth_sessions.create_index([("isActive", pymongo.ASCENDING)])
    # Automatically expire documents after 30 days (2592000 seconds) if they have a createdAt field
    # await db.auth_sessions.create_index([("createdAt", pymongo.ASCENDING)], expireAfterSeconds=2592000)

    logger.info("Successfully created all database indexes.")
    print("Indexes setup successfully.")
    await db_manager.disconnect()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(setup_indexes())
