import pytest
from unittest.mock import patch, MagicMock

def test_mock_cloudinary_upload():
    with patch("cloudinary.uploader.upload") as mock_upload:
        mock_upload.return_value = {"secure_url": "https://res.cloudinary.com/test/image.jpg"}
        
        # Simulate an upload service call
        result = mock_upload("fake_file.jpg", folder="test")
        
        assert result["secure_url"] == "https://res.cloudinary.com/test/image.jpg"
        mock_upload.assert_called_once_with("fake_file.jpg", folder="test")

def test_mock_razorpay_order_creation():
    with patch("razorpay.Client") as MockClient:
        mock_instance = MockClient.return_value
        mock_instance.order.create.return_value = {"id": "order_test123", "amount": 50000}
        
        # Simulate payment service order creation
        client = MockClient(auth=("test", "test"))
        order = client.order.create({"amount": 50000, "currency": "INR"})
        
        assert order["id"] == "order_test123"
        assert order["amount"] == 50000
        mock_instance.order.create.assert_called_once_with({"amount": 50000, "currency": "INR"})
