import pytest
import asyncio

@pytest.mark.asyncio
async def test_moderation_engine():
    from modules.reviews.moderation import moderation_engine
    
    # Test Approved
    status1 = moderation_engine.auto_moderate("Great product", "Really loved using this tractor.")
    assert status1 == "APPROVED"
    
    # Test Hidden due to blocked word
    status2 = moderation_engine.auto_moderate("Bad product", "This is a fake listing.")
    assert status2 == "HIDDEN"
    
    status3 = moderation_engine.auto_moderate("Scam alert", "Do not buy from here, it's a scam.")
    assert status3 == "HIDDEN"
