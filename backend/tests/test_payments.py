import pytest
import hmac
import hashlib


@pytest.mark.asyncio
async def test_commission_calculation():
    from modules.payments.commissions import commission_engine
    from modules.payments.constants import PaymentType

    pf, gf, t, net = commission_engine.calculate_pricing(
        PaymentType.EQUIPMENT_RENTAL, 1000.0
    )
    assert pf == 100.0
    assert gf == 20.0
    assert t == 18.0
    assert net == 862.0


def test_gateway_signature():
    from modules.payments.gateway import MockRazorpayGateway

    gw = MockRazorpayGateway(secret="test_secret")

    # 1. Mock success hardcoded bypass
    assert gw.verify_signature("order_123", "pay_123", "mock_signature_success") is True

    # 2. Actual HMAC validation
    expected = hmac.new(
        "test_secret".encode(),
        b"order_123|pay_123",
        hashlib.sha256
    ).hexdigest()
    assert gw.verify_signature("order_123", "pay_123", expected) is True

    # 3. Invalid signature
    assert gw.verify_signature("order_123", "pay_123", "invalid_sig") is False
