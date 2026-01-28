import kv from "../../../lib/redis";
import { nanoid } from "nanoid";

export async function POST(req) {
  let body;
  
  try {
    body = await req.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (!content || typeof content !== "string" || !content.trim()) {
    return new Response(
      JSON.stringify({ error: "Content is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (ttl_seconds !== undefined) {
    if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid ttl_seconds" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  if (max_views !== undefined) {
    if (!Number.isInteger(max_views) || max_views < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid max_views" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  try {
    const id = nanoid(8);
    const createdAt = Date.now();

    const paste = {
      content,
      createdAt,
      ttl_seconds: ttl_seconds ?? null,
      max_views: max_views ?? null,
      views: 0,
    };

    await kv.set(`paste:${id}`, paste);
    console.log(`✅ Paste created with ID: ${id}`);

    return new Response(
      JSON.stringify({
        id,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error creating paste:", err);
    return new Response(
      JSON.stringify({ error: "Failed to create paste. Check Redis connection." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
