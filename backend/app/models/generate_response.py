# backend/app/models/generate_response.py

from pydantic import BaseModel, Field
from typing import Optional, Literal


class GenerateResponse(BaseModel):
    """
    Response body for /api/generate.

    - project_id: ID of the generated project (folder name)
    - status: "success" or "error"
    - preview_url: URL path to view the app (under /preview)
    - download_url: URL path to download the zip (to be wired later)
    - message: human-readable summary
    - error_message: optional error details if something went wrong
    """

    project_id: str = Field(
        ...,
        description="Unique identifier for the generated project.",
    )
    status: Literal["success", "error"] = Field(
        ...,
        description="Generation status.",
    )
    preview_url: Optional[str] = Field(
        None,
        description="Relative URL to preview the generated app.",
    )
    download_url: Optional[str] = Field(
        None,
        description="Relative URL to download the generated project as a zip archive.",
    )
    message: str = Field(
        ...,
        description="Short human-readable description of what happened.",
    )
    error_message: Optional[str] = Field(
        None,
        description="Optional error details if status == 'error'.",
    )
