# backend/app/services/codegen_service.py

from pathlib import Path
from typing import Dict, Any, List

from app.services.project_service import ensure_project_dir


def write_files_to_project(project_id: str, files_spec: Dict[str, Any]) -> Path:
    """
    Given a project_id and a dict from the LLM that looks like:
    {
      "files": [
        { "path": "index.html", "content": "<!DOCTYPE html>..." },
        { "path": "style.css", "content": "body { ... }" },
        ...
      ]
    }

    This function:
    - Ensures the project directory exists.
    - Writes each file to the appropriate path under that directory.
    - Returns the Path to the project directory.
    """
    project_dir = ensure_project_dir(project_id)

    files: List[Dict[str, Any]] = files_spec.get("files", [])
    if not isinstance(files, list):
        raise ValueError("files_spec['files'] must be a list.")

    for file_def in files:
        rel_path = file_def.get("path")
        content = file_def.get("content", "")

        if not rel_path or not isinstance(rel_path, str):
            # Skip invalid entries
            continue

        target_path = project_dir / rel_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(str(content), encoding="utf-8")

    return project_dir
