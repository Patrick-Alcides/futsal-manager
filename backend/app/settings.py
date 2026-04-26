import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")


def _normalize_database_url(value: str) -> str:
    url = value.strip()
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("postgresql://") and "+psycopg" not in url:
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def _split_origins(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


DATABASE_URL = _normalize_database_url(os.getenv("DATABASE_URL", "sqlite:///./futsal.db"))
SECRET_KEY = os.getenv("SECRET_KEY", "futsal-secret-key-dev")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").strip()

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
if FRONTEND_URL and FRONTEND_URL not in DEFAULT_CORS_ORIGINS:
    DEFAULT_CORS_ORIGINS.append(FRONTEND_URL)

CORS_ORIGINS = _split_origins(os.getenv("CORS_ORIGINS", ",".join(DEFAULT_CORS_ORIGINS)))
