# backend/app/api/v1/routes_generate.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.models import GenerateRequest, GenerateResponse
from app.services.llm_service import generate_app_files_via_llm
from app.services.codegen_service import write_files_to_project
from app.services.project_service import (
    create_project_id,
    list_project_files,
    zip_project_dir,
)

router = APIRouter(
    prefix="/api",
    tags=["generate"],
)


@router.post("/generate", response_model=GenerateResponse)
async def generate_app(request: GenerateRequest) -> GenerateResponse:
    """
    AI powered implementation:
    - Create a new project id
    - Call the LLM to get file definitions
    - Write those files into the project directory
    - Return preview + download URL
    """
    project_id = create_project_id()

    try:
        # 1. Call LLM
        files_spec = generate_app_files_via_llm(
            prompt=request.prompt,
            frontend_only=request.frontend_only,
        )

        # 2. Write files to disk
        write_files_to_project(project_id, files_spec)

        preview_url = f"/preview/{project_id}/index.html"
        download_url = f"/api/download/{project_id}"

        return GenerateResponse(
            project_id=project_id,
            status="success",
            preview_url=preview_url,
            download_url=download_url,
            message="Project generated successfully.",
            error_message=None,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Generation failed: {exc}",
        )


@router.get("/projects/{project_id}")
async def get_project_info(project_id: str):
    files = list_project_files(project_id)
    if not files:
        raise HTTPException(status_code=404, detail="Project not found or empty")

    preview_url = f"/preview/{project_id}/index.html"
    download_url = f"/api/download/{project_id}"

    return {
        "project_id": project_id,
        "files": files,
        "preview_url": preview_url,
        "download_url": download_url,
    }


@router.get("/download/{project_id}")
async def download_project(project_id: str):
    try:
        project_dir, zip_path = zip_project_dir(project_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")

    return FileResponse(
        path=str(zip_path),
        filename=f"{project_id}.zip",
        media_type="application/zip",
    )
