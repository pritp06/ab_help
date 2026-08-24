from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "StudyBuddy API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/study_abroad"
    SECRET_KEY: str = "dev-secret-key-studybuddy-super-safe-cookie-sign-key-2026"
    SESSION_COOKIE_NAME: str = "study_abroad_session"
    SESSION_EXPIRE_HOURS: int = 168
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:8080", "http://127.0.0.1:8080"]
    FRONTEND_ORIGIN: str = "http://localhost:8080"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
