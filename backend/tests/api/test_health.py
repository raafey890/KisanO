import pytest

@pytest.mark.api
def test_system_health(client):
    """
    Test the unauthenticated health endpoint
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "app": "KisanO Backend", "environment": "development"}
    
@pytest.mark.api
def test_security_health(client):
    """
    Test the security subsystem health
    """
    response = client.get("/api/v1/security/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"
