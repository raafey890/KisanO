from passlib.context import CryptContext

# Enterprise standard: Argon2id for password hashing
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

class HashingEngine:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

hashing_engine = HashingEngine()
