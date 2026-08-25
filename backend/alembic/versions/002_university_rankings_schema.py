"""University rankings schema (countries, universities, ranking_providers, ranking_editions, university_rankings, university_aliases)

Revision ID: 002_university_rankings_schema
Revises: 001_initial_auth_schema
Create Date: 2026-08-25 11:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_university_rankings_schema'
down_revision: Union[str, None] = '001_initial_auth_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create countries table
    op.create_table(
        'countries',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('code', sa.String(length=3), nullable=False),
        sa.Column('region', sa.String(length=50), nullable=False),
        sa.Column('flag_emoji', sa.String(length=10), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False)
    )
    op.create_index(op.f('ix_countries_slug'), 'countries', ['slug'], unique=True)
    op.create_index(op.f('ix_countries_code'), 'countries', ['code'], unique=True)
    op.create_index(op.f('ix_countries_region'), 'countries', ['region'], unique=False)

    # 2. Create universities table
    op.create_table(
        'universities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('country_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('short_name', sa.String(length=100), nullable=True),
        sa.Column('logo_url', sa.Text(), nullable=True),
        sa.Column('website_url', sa.Text(), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('state_region', sa.String(length=100), nullable=True),
        sa.Column('postal_code', sa.String(length=20), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('institution_type', sa.String(length=100), nullable=True),
        sa.Column('founded_year', sa.Integer(), nullable=True),
        sa.Column('latitude', sa.Numeric(precision=10, scale=6), nullable=True),
        sa.Column('longitude', sa.Numeric(precision=10, scale=6), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False)
    )
    op.create_index(op.f('ix_universities_slug'), 'universities', ['slug'], unique=True)
    op.create_index(op.f('ix_universities_country_id'), 'universities', ['country_id'], unique=False)

    # 3. Create ranking_providers table
    op.create_table(
        'ranking_providers',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('website_url', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False)
    )
    op.create_index(op.f('ix_ranking_providers_slug'), 'ranking_providers', ['slug'], unique=True)

    # 4. Create ranking_editions table
    op.create_table(
        'ranking_editions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('provider_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ranking_providers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('scope', sa.String(length=50), server_default='global', nullable=False),
        sa.Column('source_url', sa.Text(), nullable=True),
        sa.Column('published_at', sa.Date(), nullable=True),
        sa.Column('source_version', sa.String(length=50), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_current', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.UniqueConstraint('provider_id', 'name', 'year', 'scope', name='uq_ranking_edition_identity')
    )
    op.create_index(op.f('ix_ranking_editions_provider_id'), 'ranking_editions', ['provider_id'], unique=False)

    # 5. Create university_rankings table
    op.create_table(
        'university_rankings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('university_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('universities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('edition_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ranking_editions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rank', sa.Integer(), nullable=False),
        sa.Column('rank_display', sa.String(length=20), nullable=False),
        sa.Column('overall_score', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('rank_status', sa.String(length=50), server_default='exact', nullable=False),
        sa.Column('source_url', sa.Text(), nullable=True),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.UniqueConstraint('university_id', 'edition_id', name='uq_university_ranking_edition')
    )
    op.create_index(op.f('ix_university_rankings_university_id'), 'university_rankings', ['university_id'], unique=False)
    op.create_index(op.f('ix_university_rankings_edition_id'), 'university_rankings', ['edition_id'], unique=False)
    op.create_index('ix_university_rankings_edition_rank', 'university_rankings', ['edition_id', 'rank'], unique=False)

    # 6. Create university_aliases table
    op.create_table(
        'university_aliases',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('university_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('universities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('alias', sa.String(length=255), nullable=False),
        sa.Column('alias_type', sa.String(length=50), server_default='abbreviation', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False)
    )
    op.create_index(op.f('ix_university_aliases_university_id'), 'university_aliases', ['university_id'], unique=False)
    op.create_index(op.f('ix_university_aliases_alias'), 'university_aliases', ['alias'], unique=False)


def downgrade() -> None:
    op.drop_table('university_aliases')
    op.drop_table('university_rankings')
    op.drop_table('ranking_editions')
    op.drop_table('ranking_providers')
    op.drop_table('universities')
    op.drop_table('countries')
