# backend/app/services/llm_service.py

import json
from typing import Any, Dict

from openai import OpenAI  # new style client

from app.core.config import get_settings


def _build_system_prompt() -> str:
    """
    System prompt that tells the model exactly how to respond.
    The model MUST return valid JSON with a "files" list.
    """
    return (
        "You are an expert full-stack developer that ONLY returns JSON. "
        "You generate small web apps based on a natural language prompt. "
        "Your response MUST be valid JSON of the form:\n\n"
        "{\n"
        '  \"files\": [\n'
        "    { \"path\": \"index.html\", \"content\": \"...\" },\n"
        "    { \"path\": \"style.css\",  \"content\": \"...\" },\n"
        "    { \"path\": \"main.js\",    \"content\": \"...\" }\n"
        "  ]\n"
        "}\n\n"
        "Rules:\n"
        "- Do not include markdown.\n"
        "- Do not include backticks.\n"
        "- Do not include comments outside JSON.\n"
        "- paths are relative file paths in the project.\n"
        "- content is the entire file content as a string.\n"
    )


def _build_user_prompt(prompt: str, frontend_only: bool) -> str:
    """
    Text that describes what the user wants and extra constraints.
    """
    mode_text = (
        "Generate ONLY a static frontend app (HTML, CSS, JS). "
        "Do NOT include any backend code."
        if frontend_only
        else "You may also include a simple backend (e.g. Python FastAPI) if appropriate."
    )

    return (
        f"User request: {prompt}\n\n"
        f"{mode_text}\n"
        "The app should be small but complete, with:\n"
        "- A main HTML file (index.html).\n"
        "- A CSS file for styling.\n"
        "- A JS file for basic interactivity.\n"
        "You may create additional files (e.g. components, assets) if helpful.\n"
    )


def generate_app_files_via_llm(prompt: str, frontend_only: bool = True) -> Dict[str, Any]:
    """
    Call the LLM to generate a JSON object describing files for a project.

    Returns a dict like:
    {
      "files": [
        { "path": "index.html", "content": "<!DOCTYPE html>..." },
        ...
      ]
    }

    Raises ValueError if the model output cannot be parsed as JSON.
    """
    settings = get_settings()

    if not settings.openai_api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Please add it to backend/.env."
        )

    client = OpenAI(api_key=settings.openai_api_key)

    system_prompt = _build_system_prompt()
    user_prompt = _build_user_prompt(prompt, frontend_only)

    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=settings.generation_temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Model returned invalid JSON. Raw content:\n{content}"
        ) from exc

    if "files" not in data or not isinstance(data["files"], list):
        raise ValueError("Model JSON must contain a 'files' list.")

    return data
