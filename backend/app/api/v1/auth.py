from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, AuthData
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


def format_user_response(user: User) -> UserResponse:
    first_name = user.profile.first_name if user.profile else None
    last_name = user.profile.last_name if user.profile else None
    return UserResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        is_verified=user.is_verified,
        is_active=user.is_active,
        first_name=first_name,
        last_name=last_name,
        created_at=user.created_at,
        last_login_at=user.last_login_at
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    req: RegisterRequest,
    response: Response,
    db: DBSession = Depends(get_db)
):
    user, raw_token = AuthService.register(
        db=db,
        email=req.email,
        password=req.password,
        first_name=req.first_name,
        last_name=req.last_name
    )
    AuthService.set_session_cookie(response, raw_token)
    return AuthResponse(data=AuthData(user=format_user_response(user)))


@router.post("/login", response_model=AuthResponse)
def login(
    req: LoginRequest,
    request: Request,
    response: Response,
    db: DBSession = Depends(get_db)
):
    user, raw_token = AuthService.login(
        db=db,
        email=req.email,
        password=req.password,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )
    AuthService.set_session_cookie(response, raw_token)
    return AuthResponse(data=AuthData(user=format_user_response(user)))


@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: DBSession = Depends(get_db)
):
    token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if token:
        AuthService.logout(db, token)
    AuthService.clear_session_cookie(response)
    return {"data": {"logged_out": True}}


@router.get("/me", response_model=AuthResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return AuthResponse(data=AuthData(user=format_user_response(current_user)))
