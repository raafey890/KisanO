import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_get_my_profile_unauthorized():
    # Attempting without auth token should fail
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_search_users_unauthorized():
    # Endpoint requires ADMIN role, accessing without token fails
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/search?query=test")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_calculate_completion_logic():
    from modules.users.service import UserService
    
    # Empty user
    user1 = {}
    score1 = UserService._calculate_completion(user1)
    assert score1 == 0
    
    # User with email and name
    user2 = {
        "email": "test@test.com",
        "profile": {"firstName": "John", "lastName": "Doe"}
    }
    score2 = UserService._calculate_completion(user2)
    assert score2 == 30 # 10 for email, 20 for name
    
    # User with farms and addresses
    user2["farms"] = [{"farmName": "Test"}]
    user2["addresses"] = [{"addressType": "Home"}]
    score3 = UserService._calculate_completion(user2)
    assert score3 == 70 # 30 + 20 (farms) + 20 (addresses)
