# backend/app/services/project_service.py

import shutil
import uuid
from pathlib import Path
from typing import List, Tuple

from app.core.config import get_settings


def get_projects_root() -> Path:
    """
    Return the root directory where all projects are stored.
    """
    settings = get_settings()
    projects_dir = settings.projects_dir
    projects_dir.mkdir(parents=True, exist_ok=True)
    return projects_dir


def create_project_id() -> str:
    """
    Generate a new unique project ID.
    """
    return str(uuid.uuid4())


def ensure_project_dir(project_id: str) -> Path:
    """
    Ensure that the directory for a given project_id exists and return it.
    """
    root = get_projects_root()
    project_dir = root / project_id
    project_dir.mkdir(parents=True, exist_ok=True)
    return project_dir


def list_project_files(project_id: str) -> List[str]:
    """
    Return a simple list of file names (relative to the project folder) for a project.
    """
    project_dir = ensure_project_dir(project_id)
    result: List[str] = []

    for path in project_dir.rglob("*"):
        if path.is_file():
            # Relative path from project_dir
            rel = path.relative_to(project_dir)
            result.append(str(rel))

    return result


def zip_project_dir(project_id: str) -> Tuple[Path, Path]:
    """
    Create a .zip archive of the project directory.

    Returns a tuple: (project_dir, zip_path)
    """
    project_dir = ensure_project_dir(project_id)
    root = get_projects_root()

    zip_name = f"{project_id}.zip"
    zip_path = root / zip_name

    # shutil.make_archive expects base_name without extension and separate format
    shutil.make_archive(
        base_name=str(zip_path.with_suffix("")),
        format="zip",
        root_dir=str(project_dir),
    )

    return project_dir, zip_path
