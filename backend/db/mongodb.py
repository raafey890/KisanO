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
        
        # Safe debug logging — never prints password or full URI
        try:
            from urllib.parse import urlparse
            parsed = urlparse(settings.MONGODB_URI)
            logger.info(f"[MongoDB Debug] MONGODB_URI present: True")
            logger.info(f"[MongoDB Debug] Hostname: {parsed.hostname}")
            logger.info(f"[MongoDB Debug] Username: {parsed.username}")
            logger.info(f"[MongoDB Debug] Database from URI path: {parsed.path}")
            logger.info(f"[MongoDB Debug] DATABASE_NAME setting: {settings.DATABASE_NAME}")
            logger.info(f"[MongoDB Debug] authSource in params: {'authSource' in (parsed.query or '')}")
            logger.info(f"[MongoDB Debug] Scheme: {parsed.scheme}")
        except Exception as debug_err:
            logger.warning(f"[MongoDB Debug] Could not parse URI for debug: {debug_err}")
        
        try:
            # tlsCAFile=certifi.where() fixes SSL handshake on Python 3.14/Windows
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=5000
            )
            cls.db = cls.client[settings.DATABASE_NAME]
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas.")
        except Exception as e:
            logger.warning(f"Failed to connect to MongoDB Atlas: {e}")
            logger.warning("Backend will run, but database features require MongoDB connection or IP whitelist.")

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
