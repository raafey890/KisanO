from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
import logging
import certifi

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        """Initialize MongoDB Connection."""
        logger.info("Connecting to MongoDB Atlas...")
        try:
            # tlsCAFile=certifi.where() fixes SSL handshake on Python 3.14/Windows
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                tlsCAFile=certifi.where()
            )
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
