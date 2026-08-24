from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.security import hash_password


def normalize_email(email: str) -> str:
    """Normalize email to lowercase stripped string."""
    return email.strip().lower()


class UserService:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        normalized = normalize_email(email)
        stmt = select(User).where(User.email == normalized)
        return db.scalar(stmt)

    @staticmethod
    def create_user(db: Session, email: str, password: str) -> User:
        normalized = normalize_email(email)
        pwd_hash = hash_password(password)
        
        user = User(
            email=normalized,
            password_hash=pwd_hash,
            is_active=True,
            is_verified=False
        )
        db.add(user)
        db.flush()
        return user
