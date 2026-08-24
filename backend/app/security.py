import secrets
import hashlib
from passlib.context import CryptContext

# Password hashing context (bcrypt / argon2)
pwd_context = CryptContext(schemes=["bcrypt", "argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash plain text password securely."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain text password against stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


def generate_session_token() -> str:
    """Generate cryptographically secure 64-character hex token."""
    return secrets.token_hex(32)


def hash_session_token(token: str) -> str:
    """Hash raw session token using SHA-256 for safe DB storage."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
