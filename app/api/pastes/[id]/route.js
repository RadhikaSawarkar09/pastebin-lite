import kv from "../../../../lib/redis";
import { nanoid } from "nanoid";

export async function POST(req) {
  let body;

  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { content } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return new Response(
      JSON.stringify({ error: "Content is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const id = nanoid(8);

  await kv.set(`paste:${id}`, {
    content,
    createdAt: Date.now(),
    views: 0,
    max_views: null,
    ttl_seconds: null,
  });

  return new Response(
    JSON.stringify({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}

export async function GET(req, context) {
  const params = await context.params;
  const id = params?.id;
  console.log(`🔍 Fetching paste with ID: ${id}`);

  try {
    const paste = await kv.get(`paste:${id}`);
    console.log(`Retrieved paste:`, paste);

    if (!paste) {
      console.log(`❌ Paste not found for ID: ${id}`);
      return new Response(
        JSON.stringify({ error: "Paste not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Returning paste content`);
    return new Response(
      JSON.stringify({ content: paste.content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error fetching paste:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch paste" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
