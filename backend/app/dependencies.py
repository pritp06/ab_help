from typing import Optional
from fastapi import Depends, Request, HTTPException, status
from sqlalchemy.orm import Session as DBSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.services.auth_service import AuthService


def get_current_user(
    request: Request,
    db: DBSession = Depends(get_db)
) -> User:
    token: Optional[str] = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required."
        )

    user = AuthService.validate_session(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session invalid or expired."
        )
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user."
        )
    return current_user
