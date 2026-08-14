from .razorpay import razorpay_gateway, RazorpayGateway, MockRazorpayGateway


def get_payment_gateway() -> RazorpayGateway:
    return razorpay_gateway


__all__ = [
    "get_payment_gateway",
    "razorpay_gateway",
    "RazorpayGateway",
    "MockRazorpayGateway",
]
