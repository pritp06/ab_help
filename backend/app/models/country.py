import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.university import University


class Country(Base, TimestampMixin):
    __tablename__ = "countries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    code: Mapped[str] = mapped_column(String(3), unique=True, index=True, nullable=False)
    region: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    flag_emoji: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    # Relationships
    universities: Mapped[List["University"]] = relationship(
        "University",
        back_populates="country",
        cascade="all, delete-orphan"
    )
