"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PastePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pasteId, setPasteId] = useState(null);

  // Extract ID from URL pathname
  useEffect(() => {
    const pathname = window.location.pathname;
    const id = pathname.split("/").pop();
    if (id) {
      setPasteId(id);
    }
  }, []);

  useEffect(() => {
    if (!pasteId) {
      return;
    }

    async function fetchPaste() {
      try {
        const res = await fetch(`/api/pastes/${pasteId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Paste not found");
          setLoading(false);
          return;
        }

        setContent(data.content);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load paste");
        setLoading(false);
      }
    }

    fetchPaste();
  }, [pasteId]);

  if (loading) return <main style={{ padding: 30 }}>Loading...</main>;
  if (error) return <main style={{ padding: 30, color: "red" }}>{error}</main>;

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>📋 Paste View</h1>
      <pre
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          overflow: "auto",
        }}
      >
        {content}
      </pre>
      <br />
      <a href="/">← Back to Create</a>
    </main>
  );
}
