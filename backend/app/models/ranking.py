import uuid
from datetime import date, datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Numeric, Boolean, Date, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.university import University


class RankingProvider(Base, TimestampMixin):
    __tablename__ = "ranking_providers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    website_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    editions: Mapped[List["RankingEdition"]] = relationship(
        "RankingEdition",
        back_populates="provider",
        cascade="all, delete-orphan"
    )


class RankingEdition(Base, TimestampMixin):
    __tablename__ = "ranking_editions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ranking_providers.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    scope: Mapped[str] = mapped_column(String(50), default="global", nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    published_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    source_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Table constraints
    __table_args__ = (
        UniqueConstraint("provider_id", "name", "year", "scope", name="uq_ranking_edition_identity"),
    )

    # Relationships
    provider: Mapped["RankingProvider"] = relationship("RankingProvider", back_populates="editions")
    rankings: Mapped[List["UniversityRanking"]] = relationship(
        "UniversityRanking",
        back_populates="edition",
        cascade="all, delete-orphan"
    )


class UniversityRanking(Base, TimestampMixin):
    __tablename__ = "university_rankings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    university_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("universities.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    edition_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ranking_editions.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    rank_display: Mapped[str] = mapped_column(String(20), nullable=False)
    overall_score: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)
    rank_status: Mapped[str] = mapped_column(String(50), default="exact", nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Table constraints & Indexes
    __table_args__ = (
        UniqueConstraint("university_id", "edition_id", name="uq_university_ranking_edition"),
        Index("ix_university_rankings_edition_rank", "edition_id", "rank"),
    )

    # Relationships
    university: Mapped["University"] = relationship("University", back_populates="rankings")
    edition: Mapped["RankingEdition"] = relationship("RankingEdition", back_populates="rankings")


class UniversityAlias(Base, TimestampMixin):
    __tablename__ = "university_aliases"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    university_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("universities.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    alias: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    alias_type: Mapped[str] = mapped_column(String(50), default="abbreviation", nullable=False)

    # Relationships
    university: Mapped["University"] = relationship("University", back_populates="aliases")
