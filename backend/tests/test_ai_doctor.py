import pytest
import asyncio
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_confidence_engine():
    from modules.ai_plant_doctor.confidence import confidence_engine
    
    # Test High Confidence
    eval1 = confidence_engine.evaluate(0.95)
    assert eval1["level"] == "HIGH"
    assert eval1["status"] == "COMPLETED"
    
    # Test Medium Confidence
    eval2 = confidence_engine.evaluate(0.85)
    assert eval2["level"] == "MEDIUM"
    assert eval2["status"] == "COMPLETED"
    
    # Test Needs Review
    eval3 = confidence_engine.evaluate(0.75)
    assert eval3["level"] == "NEEDS_REVIEW"
    assert eval3["status"] == "MANUAL_REVIEW_REQUIRED"

@pytest.mark.asyncio
async def test_mock_provider():
    from modules.ai_plant_doctor.providers import get_ai_provider
    provider = get_ai_provider("mock")
    
    assert provider.provider_name == "MockAI"
    
    response = await provider.analyze_image("http://test.jpg", {"cropName": "Tomato"})
    assert response["detectedDisease"] == "Early Blight"
    assert response["confidence"] == 0.88
    assert len(response["treatments"]) == 2
    assert response["treatments"][0]["treatmentType"] == "CHEMICAL"
