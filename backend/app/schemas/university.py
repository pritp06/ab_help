import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CountryResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    code: str
    region: str
    flag_emoji: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UniversityBaseResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    short_name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    city: Optional[str] = None
    state_region: Optional[str] = None
    institution_type: Optional[str] = None
    country: Optional[CountryResponse] = None

    model_config = ConfigDict(from_attributes=True)
