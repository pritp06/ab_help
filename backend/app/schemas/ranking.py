import uuid
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

from app.schemas.university import UniversityBaseResponse


class RankingMetaResponse(BaseModel):
    provider: str
    ranking: str
    year: int
    limit: int
    total: int


class UniversityTopItemResponse(BaseModel):
    rank: int
    rank_display: str
    score: Optional[float] = None
    rank_status: str = "exact"
    university: UniversityBaseResponse

    model_config = ConfigDict(from_attributes=True)


class UniversityTopListResponse(BaseModel):
    data: List[UniversityTopItemResponse]
    meta: RankingMetaResponse
