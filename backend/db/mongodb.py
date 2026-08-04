from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        """Initialize MongoDB Connection."""
        logger.info("Connecting to MongoDB Atlas...")
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URI)
            cls.db = cls.client[settings.DATABASE_NAME]
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas.")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise e

    @classmethod
    async def disconnect(cls):
        """Close MongoDB Connection."""
        if cls.client:
            logger.info("Closing MongoDB connection...")
            cls.client.close()
            logger.info("MongoDB connection closed.")

db_manager = DatabaseManager()

def get_db():
    """Dependency to inject database into repositories."""
    return db_manager.db
