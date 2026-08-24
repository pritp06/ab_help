from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from app.services.profile_service import ProfileService
from app.dependencies import get_current_active_user

router = APIRouter(prefix="/profile", tags=["Profiles"])


@router.get("", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_active_user),
    db: DBSession = Depends(get_db)
):
    profile = ProfileService.get_by_user_id(db, current_user.id)
    if not profile:
        profile = ProfileService.create_initial_profile(db, current_user.id)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("", response_model=ProfileResponse)
def update_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: DBSession = Depends(get_db)
):
    return ProfileService.update_profile(db, current_user.id, req)
