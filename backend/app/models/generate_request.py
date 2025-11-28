# backend/app/models/generate_request.py

from pydantic import BaseModel, Field
from typing import Optional


class GenerateRequest(BaseModel):
    """
    Request body for /api/generate.

    - prompt: natural language description of the app
    - frontend_only: if true, only HTML/CSS/JS is generated
    - template: optional preset (e.g. 'todo', 'landing', 'dashboard')
    """

    prompt: str = Field(
        ...,
        description="Description of the app to generate, in natural language.",
        examples=["A to-do app with categories and dark mode."],
    )
    frontend_only: bool = Field(
        default=True,
        description="If true, generate only a static frontend (HTML, CSS, JS).",
    )
    template: Optional[str] = Field(
        default=None,
        description="Optional template name, e.g. 'todo', 'landing', 'dashboard'.",
    )
