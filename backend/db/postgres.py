import logging
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings

logger = logging.getLogger(__name__)

class PostgresDatabaseManager:
    def __init__(self):
        self.engine = None
        self.session_factory = None

    async def connect(self):
        if not settings.DATABASE_URL:
            logger.warning("No DATABASE_URL provided. PostgreSQL will not connect.")
            logger.info("DATABASE_URL present: no")
            return
            
        logger.info("DATABASE_URL present: yes")
        
        # Safely parse and log host
        try:
            from urllib.parse import urlparse
            parsed = urlparse(settings.DATABASE_URL)
            logger.info(f"Connecting to PostgreSQL host: {parsed.hostname}")
        except Exception:
            logger.info("Connecting to PostgreSQL (could not parse host)")
            
        # Ensure asyncpg is used
        db_url = settings.DATABASE_URL
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif db_url.startswith("postgresql://"):
            db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
        logger.info("Connecting to PostgreSQL...")
        try:
            self.engine = create_async_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=10,
                max_overflow=20
            )
            self.session_factory = async_sessionmaker(
                bind=self.engine,
                expire_on_commit=False,
                class_=AsyncSession
            )
            # Test connection
            async with self.engine.begin() as conn:
                await conn.run_sync(lambda ctx: None)
            logger.info("Successfully connected to PostgreSQL.")
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL: {e}")

    async def disconnect(self):
        if self.engine:
            logger.info("Closing PostgreSQL connection...")
            await self.engine.dispose()
            logger.info("PostgreSQL connection closed.")

postgres_manager = PostgresDatabaseManager()

async def get_pg_db() -> AsyncSession:
    """Dependency to inject PostgreSQL session into repositories."""
    if not postgres_manager.session_factory:
        raise RuntimeError("Database not initialized")
    async with postgres_manager.session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
