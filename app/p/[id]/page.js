async function getPaste(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({ params }) {
  const paste = await getPaste(params.id);
  if (!paste) return <h1>404 – Paste not found</h1>;

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {paste.content}
    </pre>
  );
}
