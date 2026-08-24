import uuid
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class UserProfile(Base, TimestampMixin):
    __tablename__ = "user_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False
    )
    first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country_of_residence: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    current_degree: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    field: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    current_university: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    graduation_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gpa: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    gpa_scale: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    work_experience_years: Mapped[Optional[float]] = mapped_column(Numeric(4, 1), nullable=True)
    target_degree: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    preferred_intake: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    budget_amount: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    budget_currency: Mapped[str] = mapped_column(String(10), default="EUR", nullable=False)

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="profile")
