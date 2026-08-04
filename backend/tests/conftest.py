import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from main import app
from db.mongodb import db_manager
from tests.testing_engine import testing_engine

# Provide the global FastAPI Test Client
@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

# Configure Mock DB Provider Switching
@pytest_asyncio.fixture(autouse=True)
async def mock_db():
    mode = testing_engine.get_db_mode()
    
    if mode == "mongomock":
        # MVP: Inject mongomock to bypass real MongoDB entirely
        from mongomock_motor import AsyncMongoMockClient
        mock_client = AsyncMongoMockClient()
        db_manager.client = mock_client
        db_manager.db = mock_client.get_database("test_kisano_db")
    elif mode == "testcontainers":
        # Enterprise Mode Placeholder
        pass
        
    yield db_manager.db
    
    # Teardown logic
    if db_manager.client and mode == "mongomock":
        # Clear mock collections
        collections = await db_manager.db.list_collection_names()
        for coll in collections:
            await db_manager.db[coll].drop()
