import pytest
import pytest_asyncio
from mongomock_motor import AsyncMongoMockClient

# ─────────────────────────────────────────────────────────────────────────────
# CRITICAL: Patch db_manager BEFORE importing the application.
# This prevents lifespan from attempting a real MongoDB connection.
# ─────────────────────────────────────────────────────────────────────────────
from db.mongodb import db_manager

_mock_client = AsyncMongoMockClient()
db_manager.client = _mock_client
db_manager.db = _mock_client.get_database("test_kisano_db")

from main import app  # noqa: E402 — must come AFTER the DB patch above


# ─────────────────────────────────────────────────────────────────────────────
# Autouse async fixture: injected into every test automatically.
# Clears collections after each test for full isolation.
# ─────────────────────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(autouse=True)
async def mock_db():
    """
    Provides the in-memory MongoDB handle and cleans up after each test.
    All tests receive this fixture automatically via autouse=True.
    """
    yield db_manager.db

    # Teardown: drop all collections so tests are fully isolated
    try:
        collections = await db_manager.db.list_collection_names()
        for coll in collections:
            await db_manager.db[coll].drop()
    except Exception:
        pass
