import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Numeric, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.country import Country
    from app.models.ranking import UniversityRanking, UniversityAlias


class University(Base, TimestampMixin):
    __tablename__ = "universities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    country_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("countries.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    short_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    logo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state_region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    postal_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    institution_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    founded_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Numeric(10, 6), nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Numeric(10, 6), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    country: Mapped["Country"] = relationship("Country", back_populates="universities")
    rankings: Mapped[List["UniversityRanking"]] = relationship(
        "UniversityRanking",
        back_populates="university",
        cascade="all, delete-orphan"
    )
    aliases: Mapped[List["UniversityAlias"]] = relationship(
        "UniversityAlias",
        back_populates="university",
        cascade="all, delete-orphan"
    )
