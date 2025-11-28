📦 AI App Generator

A fully autonomous AI-powered app generator that creates complete web apps from natural-language descriptions. Built with FastAPI, React + Vite, and TailwindCSS, the system uses an LLM to generate project files, save them, preview them live, and allow instant download.

🚀 Features

Generate full apps from a single prompt

AI-generated HTML, CSS, JS (and optional backend)

Live preview for each generated project

One-click ZIP download

Clean project isolation (projects/<id>)

Fully tested backend (pytest)

Modern responsive frontend UI

🧠 Tech Stack

Backend: FastAPI, Python 3.14, OpenAI API
Frontend: React, Vite, TailwindCSS
Infra: UUID project sandboxing, static file serving, ZIP generation

🏗️ Architecture Overview
backend/
  FastAPI → LLM → file generator → preview → zip download
frontend/
  React UI → Prompt input → Preview iframe → Download
projects/
  AI-generated apps stored by project ID

💡 How It Works

User enters a prompt (e.g., “Build a scientific calculator”).

Backend calls LLM with strict JSON instructions.

LLM returns list of files with paths + contents.

Backend writes them into a new project folder.

Frontend displays a live iframe preview.

User can download the project as a ZIP.

▶️ Running Locally

Backend:

cd backend
uvicorn app.main:app --reload


Frontend:

cd frontend
npm run dev

📝 Future Improvements

Multi-file React project generation

Self-healing (auto-fix broken code via LLM)

Authentication + project history

Docker deployment

👤 Author

Toluwase Dele-Oshiga — University of Guelph
AI/Software Developer
