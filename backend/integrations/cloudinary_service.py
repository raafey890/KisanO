import logging
from typing import Optional

logger = logging.getLogger(__name__)

class CloudinaryService:
    """
    Abstraction layer for Cloudinary image uploads.
    Prevents direct coupling with the cloudinary SDK inside our services.
    """
    
    @staticmethod
    async def upload_image(file_data: bytes, folder: str = "general") -> Optional[str]:
        """
        Mock implementation of uploading an image to Cloudinary.
        In a real scenario, this would use `cloudinary.uploader.upload(file_data, folder=folder)`.
        Returns the secure URL of the uploaded image.
        """
        logger.info(f"[CloudinaryService] Simulating upload to folder '{folder}' (size: {len(file_data)} bytes)")
        # Mock URL
        return f"https://res.cloudinary.com/kisano/image/upload/v123456789/{folder}/mock_image.jpg"

cloudinary_service = CloudinaryService()
