from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession, joinedload

from app.database import get_db
from app.models.university import University
from app.models.country import Country
from app.models.ranking import UniversityRanking
from app.schemas.ranking import (
    UniversityTopListResponse,
    UniversityTopItemResponse,
    RankingMetaResponse
)
from app.schemas.university import UniversityBaseResponse, CountryResponse
from app.services.ranking_service import RankingService

router = APIRouter(prefix="/universities", tags=["Universities & Rankings"])


def format_ranking_item(ur: UniversityRanking) -> UniversityTopItemResponse:
    u = ur.university
    c = u.country if u else None

    country_resp = CountryResponse(
        id=c.id,
        name=c.name,
        slug=c.slug,
        code=c.code,
        region=c.region,
        flag_emoji=c.flag_emoji
    ) if c else None

    uni_resp = UniversityBaseResponse(
        id=u.id,
        name=u.name,
        slug=u.slug,
        short_name=u.short_name,
        logo_url=u.logo_url,
        website_url=u.website_url,
        city=u.city,
        state_region=u.state_region,
        institution_type=u.institution_type,
        country=country_resp
    )

    return UniversityTopItemResponse(
        rank=ur.rank,
        rank_display=ur.rank_display,
        score=float(ur.overall_score) if ur.overall_score is not None else None,
        rank_status=ur.rank_status,
        university=uni_resp
    )


@router.get("/top", response_model=UniversityTopListResponse)
def get_top_universities(
    provider: str = Query("QS", description="Ranking provider (e.g. QS)"),
    year: Optional[int] = Query(None, description="Ranking year (defaults to current edition 2027)"),
    limit: int = Query(200, ge=1, le=500),
    page: int = Query(1, ge=1),
    country: Optional[str] = Query(None, description="Country code, slug, or name"),
    region: Optional[str] = Query(None, description="Geographic region (e.g. Europe, North America, Asia)"),
    search: Optional[str] = Query(None, description="Search query string"),
    db: DBSession = Depends(get_db)
):
    rankings, total, edition = RankingService.get_top_universities(
        db=db,
        provider_slug=provider,
        year=year,
        limit=limit,
        page=page,
        country_filter=country,
        region_filter=region,
        search_query=search
    )

    meta = RankingMetaResponse(
        provider=provider.upper(),
        ranking=edition.name if edition else "QS World University Rankings",
        year=edition.year if edition else 2027,
        limit=limit,
        total=total
    )

    items = [format_ranking_item(ur) for ur in rankings]
    return UniversityTopListResponse(data=items, meta=meta)


@router.get("/rankings", response_model=UniversityTopListResponse)
def get_university_rankings(
    provider: str = Query("QS"),
    year: Optional[int] = Query(None),
    limit: int = Query(200, ge=1, le=500),
    page: int = Query(1, ge=1),
    country: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: DBSession = Depends(get_db)
):
    return get_top_universities(provider, year, limit, page, country, region, search, db)


@router.get("/{slug}")
def get_university_detail(slug: str, db: DBSession = Depends(get_db)):
    stmt = (
        select(University)
        .options(
            joinedload(University.country),
            joinedload(University.rankings).joinedload(UniversityRanking.edition)
        )
        .where(University.slug == slug)
    )
    uni = db.scalar(stmt)
    if not uni:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"University with slug '{slug}' not found."
        )

    # Get current QS 2027 ranking
    current_ranking = None
    for r in uni.rankings:
        if r.edition and r.edition.is_current:
            current_ranking = {
                "rank": r.rank,
                "rank_display": r.rank_display,
                "score": float(r.overall_score) if r.overall_score is not None else None,
                "edition_name": r.edition.name,
                "year": r.edition.year,
                "source_url": r.source_url or r.edition.source_url
            }
            break

    c = uni.country
    country_resp = {
        "id": str(c.id),
        "name": c.name,
        "slug": c.slug,
        "code": c.code,
        "region": c.region,
        "flag_emoji": c.flag_emoji
    } if c else None

    return {
        "data": {
            "id": str(uni.id),
            "name": uni.name,
            "slug": uni.slug,
            "short_name": uni.short_name,
            "logo_url": uni.logo_url,
            "website_url": uni.website_url,
            "city": uni.city,
            "state_region": uni.state_region,
            "description": uni.description,
            "institution_type": uni.institution_type,
            "founded_year": uni.founded_year,
            "country": country_resp,
            "ranking": current_ranking
        }
    }
