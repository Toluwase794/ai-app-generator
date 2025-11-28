# backend/app/core/config.py

import os
from pathlib import Path
from functools import lru_cache
from typing import Optional


class Settings:
    """
    Simple settings object for the backend.

    Values are read from environment variables, with sensible defaults.
    """

    def __init__(self) -> None:
        # API key for OpenAI (or other LLM provider)
        self.openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")

        # Model name to use for code generation
        # You can override this in .env with OPENAI_MODEL="gpt-4.1-mini" etc.
        self.openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

        # Base directory where generated projects are stored
        projects_dir_env = os.getenv("PROJECTS_DIR", "../projects")
        self.projects_dir: Path = Path(projects_dir_env).resolve()

        # Temperature for creativity vs determinism
        # 0.0 = very strict, 1.0 = creative
        self.generation_temperature: float = float(
            os.getenv("GENERATION_TEMPERATURE", "0.2")
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return a cached Settings instance so we only read env vars once.
    """
    return Settings()
