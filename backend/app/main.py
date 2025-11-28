# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from pathlib import Path
import os

from app.api.v1.routes_generate import router as generate_router

# Load environment variables from backend/.env
load_dotenv()

# Base directory for generated projects
PROJECTS_DIR = Path(os.getenv("PROJECTS_DIR", "../projects")).resolve()
PROJECTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="AI App Generator Backend",
    version="0.1.0",
    description="Backend API for generating and serving AI-built apps.",
)

# CORS settings - allow frontend dev server
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the generated projects as static files for preview
app.mount(
    "/preview",
    StaticFiles(directory=str(PROJECTS_DIR)),
    name="preview",
)

# Include API routes
app.include_router(generate_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


# For running with:  python -m app.main  (optional)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
