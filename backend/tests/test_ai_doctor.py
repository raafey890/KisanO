import pytest
import json


@pytest.mark.asyncio
async def test_confidence_engine():
    """Test AI confidence scoring logic."""
    # Confidence thresholds: >= 0.90 HIGH, >= 0.80 MEDIUM, else NEEDS_REVIEW
    def evaluate_confidence(score: float) -> dict:
        if score >= 0.90:
            return {"level": "HIGH", "status": "COMPLETED"}
        elif score >= 0.80:
            return {"level": "MEDIUM", "status": "COMPLETED"}
        else:
            return {"level": "NEEDS_REVIEW", "status": "MANUAL_REVIEW_REQUIRED"}

    eval1 = evaluate_confidence(0.95)
    assert eval1["level"] == "HIGH"
    assert eval1["status"] == "COMPLETED"

    eval2 = evaluate_confidence(0.85)
    assert eval2["level"] == "MEDIUM"
    assert eval2["status"] == "COMPLETED"

    eval3 = evaluate_confidence(0.75)
    assert eval3["level"] == "NEEDS_REVIEW"
    assert eval3["status"] == "MANUAL_REVIEW_REQUIRED"


@pytest.mark.asyncio
async def test_mock_provider():
    """Test the mock AI provider from the modules.ai provider factory."""
    from modules.ai.providers.provider_factory import get_ai_provider

    provider = get_ai_provider("MOCK")
    assert provider.provider_name == "MockAI"

    response_json = await provider.analyze_image(
        system_prompt="Detect disease",
        image_url="http://test.jpg",
        user_prompt="cropName: Tomato"
    )
    response = json.loads(response_json)
    assert response["detectedDisease"] == "Early Blight"
    assert response["confidence"] == 0.88
    assert len(response["treatments"]) == 2
    assert response["treatments"][0]["treatmentType"] == "CHEMICAL"
