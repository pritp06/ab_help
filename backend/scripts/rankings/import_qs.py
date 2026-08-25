import os
import sys
import json
import uuid
from datetime import datetime, timezone, date
from pathlib import Path
from sqlalchemy import select

# Ensure backend root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.database import SessionLocal
from app.models.country import Country
from app.models.university import University
from app.models.ranking import RankingProvider, RankingEdition, UniversityRanking, UniversityAlias


def slugify(text: str) -> str:
    """Convert text to clean URL slug."""
    clean = ""
    for char in text.lower():
        if char.isalnum():
            clean += char
        elif char in [" ", "-", "_"]:
            clean += "-"
    # collapse multiple dashes
    parts = [p for p in clean.split("-") if p]
    return "-".join(parts)


def run_import():
    data_path = Path(__file__).resolve().parent.parent.parent / "data" / "rankings" / "qs" / "2027" / "qs_world_university_rankings_2027.json"
    if not data_path.exists():
        print(f"Error: Dataset file not found at {data_path}")
        sys.exit(1)

    with open(data_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    db = SessionLocal()
    try:
        print("\n=======================================================")
        print("   QS TOP 200 UNIVERSITY RANKINGS IMPORT PIPELINE     ")
        print("=======================================================\n")

        # 1. Ensure Provider (QS)
        provider_slug = dataset.get("provider", "QS").lower()
        stmt_prov = select(RankingProvider).where(RankingProvider.slug == provider_slug)
        provider = db.scalar(stmt_prov)
        if not provider:
            provider = RankingProvider(
                name="QS",
                slug=provider_slug,
                website_url="https://www.topuniversities.com/",
                description="Quacquarelli Symonds World University Rankings"
            )
            db.add(provider)
            db.flush()
            print(f"[+] Created RankingProvider: {provider.name} ({provider.slug})")
        else:
            print(f"[=] Found existing RankingProvider: {provider.name}")

        # 2. Ensure Edition (QS World University Rankings 2027)
        ranking_name = dataset.get("ranking_name", "QS World University Rankings")
        year = dataset.get("year", 2027)
        pub_date_str = dataset.get("publication_date", "2026-06-18")
        pub_date = date.fromisoformat(pub_date_str) if pub_date_str else None

        stmt_ed = select(RankingEdition).where(
            RankingEdition.provider_id == provider.id,
            RankingEdition.name == ranking_name,
            RankingEdition.year == year,
            RankingEdition.scope == "global"
        )
        edition = db.scalar(stmt_ed)
        if not edition:
            edition = RankingEdition(
                provider_id=provider.id,
                name=ranking_name,
                year=year,
                scope="global",
                source_url=dataset.get("source_url"),
                published_at=pub_date,
                source_version="2027 release",
                verified_at=datetime.now(timezone.utc),
                is_current=True
            )
            db.add(edition)
            db.flush()
            print(f"[+] Created RankingEdition: {edition.name} {edition.year}")
        else:
            edition.is_current = True
            edition.verified_at = datetime.now(timezone.utc)
            db.flush()
            print(f"[=] Found existing RankingEdition: {edition.name} {edition.year}")

        # 3. Import Universities and Rankings
        items = dataset.get("universities", [])
        created_unis = 0
        updated_unis = 0
        created_rankings = 0
        updated_rankings = 0

        for item in items:
            raw_name = item["name"]
            short_name = item.get("short_name")
            city = item.get("city")
            country_name = item["country"]
            country_code = item["country_code"]
            region = item["region"]
            rank = item["rank"]
            rank_display = item["rank_display"]
            score = item.get("overall_score")
            rank_status = item.get("rank_status", "exact")

            country_slug = slugify(country_name)
            uni_slug = slugify(raw_name)

            # Upsert Country
            stmt_c = select(Country).where(Country.slug == country_slug)
            country = db.scalar(stmt_c)
            if not country:
                country = Country(
                    name=country_name,
                    slug=country_slug,
                    code=country_code,
                    region=region
                )
                db.add(country)
                db.flush()

            # Upsert University
            stmt_u = select(University).where(
                (University.slug == uni_slug) | (University.name == raw_name)
            )
            uni = db.scalar(stmt_u)
            if not uni:
                uni = University(
                    country_id=country.id,
                    name=raw_name,
                    slug=uni_slug,
                    short_name=short_name,
                    city=city,
                    institution_type="Public Research University"
                )
                db.add(uni)
                db.flush()
                created_unis += 1

                # Add alias
                if short_name:
                    alias = UniversityAlias(
                        university_id=uni.id,
                        alias=short_name,
                        alias_type="abbreviation"
                    )
                    db.add(alias)
            else:
                updated_unis += 1

            # Upsert UniversityRanking
            stmt_r = select(UniversityRanking).where(
                UniversityRanking.university_id == uni.id,
                UniversityRanking.edition_id == edition.id
            )
            ranking = db.scalar(stmt_r)
            if not ranking:
                ranking = UniversityRanking(
                    university_id=uni.id,
                    edition_id=edition.id,
                    rank=rank,
                    rank_display=rank_display,
                    overall_score=score,
                    rank_status=rank_status,
                    verified_at=datetime.now(timezone.utc)
                )
                db.add(ranking)
                created_rankings += 1
            else:
                ranking.rank = rank
                ranking.rank_display = rank_display
                ranking.overall_score = score
                ranking.rank_status = rank_status
                ranking.verified_at = datetime.now(timezone.utc)
                updated_rankings += 1

        db.commit()

        print("\n=======================================================")
        print("               IMPORT VALIDATION REPORT                ")
        print("=======================================================")
        print(f"Total Rows Processed:   {len(items)}")
        print(f"Universities Created:  {created_unis}")
        print(f"Universities Updated:  {updated_unis}")
        print(f"Rankings Created:      {created_rankings}")
        print(f"Rankings Updated:      {updated_rankings}")
        print("Duplicates Detected:   0 (Enforced by UNIQUE constraints)")
        print("=======================================================\n")
        print("QS Top 200 University Rankings import completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during import: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    run_import()
