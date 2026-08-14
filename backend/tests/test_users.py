import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_get_my_profile_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_search_users_unauthorized(mock_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/search?query=test")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_calculate_completion_logic():
    from modules.users.service import UserService

    user1 = {}
    score1 = UserService._calculate_completion(user1)
    assert score1 == 0

    user2 = {
        "email": "test@test.com",
        "profile": {"firstName": "John", "lastName": "Doe"}
    }
    score2 = UserService._calculate_completion(user2)
    assert score2 == 30

    user2["farms"] = [{"farmName": "Test"}]
    user2["addresses"] = [{"addressType": "Home"}]
    score3 = UserService._calculate_completion(user2)
    assert score3 == 70
