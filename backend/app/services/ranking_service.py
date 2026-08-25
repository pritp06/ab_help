import uuid
from typing import Optional, List, Tuple
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, joinedload

from app.models.country import Country
from app.models.university import University
from app.models.ranking import RankingProvider, RankingEdition, UniversityRanking, UniversityAlias


class RankingService:
    @staticmethod
    def get_current_edition(
        db: Session,
        provider_slug: str = "qs",
        year: Optional[int] = None
    ) -> Optional[RankingEdition]:
        stmt = (
            select(RankingEdition)
            .join(RankingProvider)
            .where(RankingProvider.slug == provider_slug.lower())
        )
        if year:
            stmt = stmt.where(RankingEdition.year == year)
        else:
            stmt = stmt.where(RankingEdition.is_current == True)

        return db.scalar(stmt)

    @staticmethod
    def get_top_universities(
        db: Session,
        provider_slug: str = "qs",
        year: Optional[int] = None,
        limit: int = 200,
        page: int = 1,
        country_filter: Optional[str] = None,
        region_filter: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> Tuple[List[UniversityRanking], int, Optional[RankingEdition]]:
        edition = RankingService.get_current_edition(db, provider_slug, year)
        if not edition:
            return [], 0, None

        # Build base query joining University & Country
        stmt = (
            select(UniversityRanking)
            .options(
                joinedload(UniversityRanking.university).joinedload(University.country)
            )
            .join(University, UniversityRanking.university_id == University.id)
            .join(Country, University.country_id == Country.id)
            .where(
                UniversityRanking.edition_id == edition.id,
                UniversityRanking.rank <= 200
            )
        )

        # Country Filter (Code, Slug, or Name)
        if country_filter:
            cf = country_filter.strip().lower()
            stmt = stmt.where(
                or_(
                    func.lower(Country.code) == cf,
                    func.lower(Country.slug) == cf,
                    func.lower(Country.name) == cf
                )
            )

        # Region Filter
        if region_filter:
            rf = region_filter.strip().lower()
            stmt = stmt.where(func.lower(Country.region) == rf)

        # Search Query (University Name, Short Name, City, or Aliases)
        if search_query:
            sq = f"%{search_query.strip().lower()}%"
            # Subquery for alias match
            alias_subq = (
                select(UniversityAlias.university_id)
                .where(func.lower(UniversityAlias.alias).like(sq))
            )
            stmt = stmt.where(
                or_(
                    func.lower(University.name).like(sq),
                    func.lower(University.short_name).like(sq),
                    func.lower(University.city).like(sq),
                    University.id.in_(alias_subq)
                )
            )

        # Count total matching records before pagination
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = db.scalar(count_stmt) or 0

        # Ordering & Pagination
        stmt = stmt.order_by(UniversityRanking.rank.asc())
        offset = (page - 1) * limit
        stmt = stmt.offset(offset).limit(limit)

        results = db.scalars(stmt).unique().all()
        return list(results), total, edition

    @staticmethod
    def get_university_ranking_detail(
        db: Session,
        university_id: uuid.UUID,
        provider_slug: str = "qs",
        year: Optional[int] = None
    ) -> Optional[UniversityRanking]:
        edition = RankingService.get_current_edition(db, provider_slug, year)
        if not edition:
            return None

        stmt = (
            select(UniversityRanking)
            .options(
                joinedload(UniversityRanking.university).joinedload(University.country),
                joinedload(UniversityRanking.edition).joinedload(RankingEdition.provider)
            )
            .where(
                UniversityRanking.university_id == university_id,
                UniversityRanking.edition_id == edition.id
            )
        )
        return db.scalar(stmt)
