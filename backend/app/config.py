import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME = "CivicSage"
    APP_VERSION = "0.1.0"

    FRONTEND_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BASE_DIR / "data"

    @classmethod
    def has_gemini_key(cls) -> bool:
        return bool(cls.GEMINI_API_KEY)
