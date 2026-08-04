import mimetypes
from fastapi import UploadFile
from core.exceptions import AppException
import logging

logger = logging.getLogger(__name__)

class UploadSecurityEngine:
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf", ".csv"}
    ALLOWED_MIMES = {"image/jpeg", "image/png", "application/pdf", "text/csv"}
    MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

    @classmethod
    async def validate_upload(cls, file: UploadFile):
        # 1. Extension Validation
        ext = ""
        if file.filename:
            ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
            
        if ext not in cls.ALLOWED_EXTENSIONS:
            logger.warning(f"Rejected upload: invalid extension {ext}")
            raise AppException(status_code=400, detail="File type not allowed")

        # 2. MIME Validation
        if file.content_type not in cls.ALLOWED_MIMES:
            logger.warning(f"Rejected upload: invalid mime {file.content_type}")
            raise AppException(status_code=400, detail="MIME type not allowed")

        # 3. Size Validation (FastAPI Spool file size check)
        file.file.seek(0, 2) # seek to end
        size = file.file.tell()
        file.file.seek(0) # reset
        if size > cls.MAX_SIZE_BYTES:
            logger.warning(f"Rejected upload: size {size} bytes exceeds limit")
            raise AppException(status_code=400, detail="File too large")

        # 4. Future Hooks
        # - Magic Number validation (python-magic)
        # - Virus scanning (ClamAV)
        # - Image Sanitization (Pillow strip EXIF)

upload_security_engine = UploadSecurityEngine()
