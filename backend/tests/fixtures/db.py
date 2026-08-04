import pytest_asyncio
from tests.testing_engine import testing_engine

@pytest_asyncio.fixture
async def seed_mongodb(mock_db):
    """
    Reusable fixture to inject specific seed states into the mock database.
    """
    users = mock_db.get_collection("users")
    await users.insert_one({"_id": "mock_id", "email": "test@kisano.com", "role": "USER"})
    return mock_db
