"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");
    setPasteUrl("");

    if (!content.trim()) {
      setError("Please enter some text");
      return;
    }

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setPasteUrl(data.url);
      setContent("");
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  }

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>📋 Pastebin Lite</h1>

      <textarea
        rows={10}
        cols={70}
        placeholder="Write your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <button
        onClick={createPaste}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Create Paste
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {pasteUrl && (
        <p>
          ✅ Paste created! <br />
          Share this link: <br />
          <a href={pasteUrl} target="_blank">{pasteUrl}</a>
        </p>
      )}
    </main>
  );
}
