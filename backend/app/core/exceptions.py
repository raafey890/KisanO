class KisanOException(Exception):
    def __init__(self, message: str, status_code: int = 400, errors: any = None):
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(self.message)

class CredentialException(KisanOException):
    def __init__(self, message: str = "Invalid credentials"):
        super().__init__(message=message, status_code=401)

class OverlappingBookingException(KisanOException):
    def __init__(self, message: str = "Selected time slot overlaps with an existing booking"):
        super().__init__(message=message, status_code=400)

class NotFoundException(KisanOException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)

class ForbiddenException(KisanOException):
    def __init__(self, message: str = "Access denied"):
        super().__init__(message=message, status_code=403)
