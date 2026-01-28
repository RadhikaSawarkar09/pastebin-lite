import kv from "../../../lib/redis";


function now(req) {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.headers.get("x-test-now-ms");
    if (testNow) return Number(testNow);
  }
  return Date.now();
}

export async function GET(req, { params }) {
  const key = `paste:${params.id}`;
  const paste = await kv.get(key);
  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = now(req);

  // TTL check
  if (paste.ttl_seconds) {
    const expiresAt = paste.createdAt + paste.ttl_seconds * 1000;
    if (currentTime >= expiresAt) {
      await kv.del(key);
      return Response.json({ error: "Expired" }, { status: 404 });
    }
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - paste.views,
    expires_at: paste.ttl_seconds
      ? new Date(paste.createdAt + paste.ttl_seconds * 1000).toISOString()
      : null,
  });
}
