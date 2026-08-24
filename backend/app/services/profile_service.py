import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_profile import UserProfile
from app.schemas.profile import ProfileUpdateRequest


class ProfileService:
    @staticmethod
    def get_by_user_id(db: Session, user_id: uuid.UUID) -> Optional[UserProfile]:
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        return db.scalar(stmt)

    @staticmethod
    def create_initial_profile(db: Session, user_id: uuid.UUID, first_name: Optional[str] = None, last_name: Optional[str] = None) -> UserProfile:
        profile = UserProfile(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name
        )
        db.add(profile)
        db.flush()
        return profile

    @staticmethod
    def update_profile(db: Session, user_id: uuid.UUID, update_data: ProfileUpdateRequest) -> UserProfile:
        profile = ProfileService.get_by_user_id(db, user_id)
        if not profile:
            profile = ProfileService.create_initial_profile(db, user_id)

        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(profile, key, value)

        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
