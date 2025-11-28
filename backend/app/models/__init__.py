# backend/app/models/__init__.py

"""
Pydantic models for the AI App Generator backend.

These models define:
- Request payloads sent from the frontend to the API
- Response payloads returned by the API
"""

from .generate_request import GenerateRequest
from .generate_response import GenerateResponse

__all__ = [
    "GenerateRequest",
    "GenerateResponse",
]
