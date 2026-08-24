import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple
from fastapi import Response, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.config import settings
from app.models.user import User
from app.models.session import Session as UserSession
from app.models.user_profile import UserProfile
from app.security import (
    verify_password,
    generate_session_token,
    hash_session_token
)
from app.services.user_service import UserService, normalize_email
from app.services.profile_service import ProfileService


class AuthService:
    @staticmethod
    def create_session(
        db: DBSession,
        user_id: uuid.UUID,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[str, UserSession]:
        raw_token = generate_session_token()
        token_hash = hash_session_token(raw_token)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.SESSION_EXPIRE_HOURS)

        session = UserSession(
            user_id=user_id,
            session_token_hash=token_hash,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(session)
        db.flush()
        return raw_token, session

    @staticmethod
    def validate_session(db: DBSession, raw_token: str) -> Optional[User]:
        if not raw_token:
            return None

        token_hash = hash_session_token(raw_token)
        stmt = select(UserSession).where(
            UserSession.session_token_hash == token_hash,
            UserSession.revoked_at.is_(None),
            UserSession.expires_at > datetime.now(timezone.utc)
        )
        session = db.scalar(stmt)
        if not session:
            return None

        user = db.get(User, session.user_id)
        if not user or not user.is_active:
            return None

        # Update last_seen_at
        session.last_seen_at = datetime.now(timezone.utc)
        db.commit()
        return user

    @staticmethod
    def register(
        db: DBSession,
        email: str,
        password: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None
    ) -> Tuple[User, str]:
        normalized = normalize_email(email)
        existing = UserService.get_by_email(db, normalized)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists."
            )

        try:
            # Atomic creation: user + profile + session
            user = UserService.create_user(db, normalized, password)
            ProfileService.create_initial_profile(db, user.id, first_name, last_name)
            raw_token, _ = AuthService.create_session(db, user.id)
            
            db.commit()
            db.refresh(user)
            return user, raw_token
        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def login(
        db: DBSession,
        email: str,
        password: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[User, str]:
        user = UserService.get_by_email(db, email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive. Please contact support."
            )

        user.last_login_at = datetime.now(timezone.utc)
        raw_token, _ = AuthService.create_session(db, user.id, ip_address, user_agent)
        
        db.commit()
        db.refresh(user)
        return user, raw_token

    @staticmethod
    def logout(db: DBSession, raw_token: str) -> bool:
        if not raw_token:
            return False

        token_hash = hash_session_token(raw_token)
        stmt = select(UserSession).where(UserSession.session_token_hash == token_hash)
        session = db.scalar(stmt)
        if session:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()
            return True
        return False

    @staticmethod
    def set_session_cookie(response: Response, raw_token: str):
        response.set_cookie(
            key=settings.SESSION_COOKIE_NAME,
            value=raw_token,
            max_age=settings.SESSION_EXPIRE_HOURS * 3600,
            httponly=True,
            samesite="lax",
            secure=settings.APP_ENV == "production",
            path="/"
        )

    @staticmethod
    def clear_session_cookie(response: Response):
        response.delete_cookie(
            key=settings.SESSION_COOKIE_NAME,
            httponly=True,
            samesite="lax",
            secure=settings.APP_ENV == "production",
            path="/"
        )
