# backend/tests/test_generate.py

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok"


def test_generate_app_placeholder():
    payload = {
        "prompt": "A simple counter app with increment and reset buttons.",
        "frontend_only": True,
    }

    response = client.post("/api/generate", json=payload)
    assert response.status_code == 200

    data = response.json()

    # basic sanity checks
    assert "project_id" in data
    assert isinstance(data["project_id"], str)
    assert "preview_url" in data
    assert isinstance(data["preview_url"], str)
    assert "message" in data
    assert isinstance(data["message"], str)

    # preview_url should point to /preview/<id>/index.html
    assert data["preview_url"].startswith("/preview/")
    assert data["preview_url"].endswith("index.html")
