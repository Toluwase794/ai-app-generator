// src/App.jsx
import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [frontendOnly, setFrontendOnly] = useState(true);
  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [history, setHistory] = useState([]);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setStatus("Sending prompt to backend…");
    setPreviewUrl("");
    setDownloadUrl("");

    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          frontend_only: frontendOnly,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || `Request failed with ${res.status}`);
      }

      const data = await res.json();

      const fullPreview = `${API_BASE}${data.preview_url}`;
      const fullDownload = `${API_BASE}${data.download_url}`;

      setPreviewUrl(fullPreview);
      setDownloadUrl(fullDownload);
      setStatus("Project generated successfully.");

      setHistory((prev) => [
        {
          id: data.project_id,
          prompt: prompt.trim(),
          previewUrl: fullPreview,
          downloadedUrl: fullDownload,
          createdAt: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleUseTemplate(text) {
    setPrompt(text);
  }

  function handleHistoryClick(item) {
    setPreviewUrl(item.previewUrl);
    setDownloadUrl(item.downloadedUrl);
    setStatus(`Showing previous app from ${item.createdAt}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-purple-50 to-white text-slate-900">
      {/* Top hero */}
      <header className="max-w-5xl mx-auto px-6 pt-8 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          What will you design today?
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          Describe your idea and your AI app generator will turn it into code.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 bg-white/70 border border-slate-200 rounded-full px-3 py-1 text-xs md:text-sm shadow-sm">
          <button className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Your designs
          </button>
          <button className="px-3 py-1 rounded-full hover:bg-slate-100 text-slate-600">
            Templates
          </button>
          <button className="px-3 py-1 rounded-full bg-slate-900 text-white">
            AI Code
          </button>
        </div>
      </header>

      {/* Main layout: left prompt, right preview */}
      <main className="max-w-6xl mx-auto px-6 pb-10 flex flex-col gap-6">
        <section className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* LEFT: prompt card */}
          <div className="md:w-[45%] flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Describe your app</h2>
              <p className="text-xs text-slate-500">
                Write what you want built and we&apos;ll generate the code.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col gap-3">
              <label className="text-xs font-medium text-slate-600">
                Prompt
              </label>
              <textarea
                className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                placeholder="E.g. Build a fully functional scientific calculator with trig functions, log, ln, parentheses and a clean modern UI."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={frontendOnly}
                  onChange={(e) => setFrontendOnly(e.target.checked)}
                />
                Frontend only (HTML/CSS/JS)
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-sky-500 text-white text-sm font-semibold px-4 py-2 shadow-md hover:bg-sky-600 disabled:opacity-60"
                >
                  {loading ? "Generating…" : "Generate app"}
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    className="text-xs text-sky-700 underline"
                  >
                    Download project ZIP
                  </a>
                )}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Status: {status}
              </div>
            </form>

            {/* Quick templates row */}
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-600 mb-2">
                Try a quick template:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleUseTemplate(
                      "Build a fully functional scientific calculator with sin, cos, tan, log10, ln, parentheses and a responsive layout."
                    )
                  }
                  className="chip-btn"
                >
                  Scientific calculator
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUseTemplate(
                      "Create a simple habit tracker dashboard with a weekly calendar and completion checkboxes."
                    )
                  }
                  className="chip-btn"
                >
                  Habit tracker
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUseTemplate(
                      "Build a clean portfolio landing page with a hero section, projects grid, and contact form."
                    )
                  }
                  className="chip-btn"
                >
                  Portfolio page
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: preview card */}
          <div className="md:flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Live preview</h2>
              <span className="text-xs text-emerald-600">
                {previewUrl ? "Generated" : "Waiting for prompt"}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-inner p-3 h-[420px] flex items-center justify-center">
              {previewUrl ? (
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  title="Generated app preview"
                  className="preview-frame"
                />
              ) : (
                <p className="text-xs text-slate-500 text-center px-4">
                  Your generated app will appear here. Describe an idea on the
                  left and click <span className="font-semibold">Generate</span>{" "}
                  to see it live.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* History section (bottom) */}
        {history.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Recent generations
            </h3>
            <ul className="grid gap-3 md:grid-cols-3 text-xs">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="bg-white/80 border border-slate-200 rounded-xl p-3 cursor-pointer hover:shadow-sm transition"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] px-2 py-[2px] rounded-full bg-sky-100 text-sky-700">
                      {item.createdAt}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      #{item.id.slice(0, 6)}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-slate-700">{item.prompt}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
