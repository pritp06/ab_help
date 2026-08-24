import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ProfileBase(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    country_of_residence: Optional[str] = Field(None, max_length=100)
    current_degree: Optional[str] = Field(None, max_length=100)
    field: Optional[str] = Field(None, max_length=150)
    current_university: Optional[str] = Field(None, max_length=255)
    graduation_year: Optional[int] = Field(None, ge=1970, le=2100)
    gpa: Optional[float] = Field(None, ge=0.0, le=10.0)
    gpa_scale: Optional[float] = Field(None, ge=1.0, le=10.0)
    work_experience_years: Optional[float] = Field(None, ge=0.0, le=50.0)
    target_degree: Optional[str] = Field(None, max_length=100)
    preferred_intake: Optional[str] = Field(None, max_length=50)
    budget_amount: Optional[int] = Field(None, ge=0)
    budget_currency: str = "EUR"


class ProfileUpdateRequest(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
