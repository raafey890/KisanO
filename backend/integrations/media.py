import logging
import uuid
from typing import Optional

logger = logging.getLogger(__name__)

class MediaService:
    """
    Abstracts media uploads. 
    Currently mocks Cloudinary integration for local development.
    """
    
    @staticmethod
    async def upload_image(file_bytes: bytes, file_name: str, folder: str = "general") -> str:
        """
        Mocks uploading an image to Cloudinary and returns a simulated secure URL.
        In a real scenario, this would use cloudinary.uploader.upload().
        """
        # Validate size (e.g., max 5MB)
        if len(file_bytes) > 5 * 1024 * 1024:
            raise ValueError("File size exceeds the 5MB limit.")
            
        logger.info(f"Mock Uploading {file_name} to Cloudinary folder '{folder}'...")
        
        # Generate a mock URL
        mock_id = uuid.uuid4().hex[:10]
        return f"https://res.cloudinary.com/kisano/image/upload/v1/{folder}/{mock_id}_{file_name}"
        
    @staticmethod
    async def delete_image(image_url: str) -> bool:
        """
        Mocks deleting an image from Cloudinary.
        """
        logger.info(f"Mock Deleting image from Cloudinary: {image_url}")
        return True

media_service = MediaService()
