import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    role: str = "user"
    is_verified: bool = False
    is_active: bool = True


class UserResponse(UserBase):
    id: uuid.UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
