import fetch from "node-fetch";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

function api(path: string) {
  return `${CHROMA_URL.replace(/\/$/, "")}${path}`;
}

export async function createCollection(name: string) {
  const res = await fetch(api(`/collections`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createCollection failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function upsertVectors(name: string, embeddings: Array<{ id: string; vector: number[]; metadata?: any; }>) {
  // Chroma add API typically: {ids:[], embeddings: [], metadatas: [], documents: []}
  const ids = embeddings.map(e => e.id);
  const vectors = embeddings.map(e => e.vector);
  const metadatas = embeddings.map(e => e.metadata || null);
  const documents = embeddings.map(e => e.metadata?.text ?? "");
  const res = await fetch(api(`/collections/${encodeURIComponent(name)}/add`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, embeddings: vectors, metadatas, documents }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`upsertVectors failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function queryCollection(name: string, queryVector: number[], topK = 5) {
  const res = await fetch(api(`/collections/${encodeURIComponent(name)}/query`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query_embeddings: [queryVector], n_results: topK, include: ["metadatas","documents","distances"] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`queryCollection failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function deleteCollection(name: string) {
  const res = await fetch(api(`/collections/${encodeURIComponent(name)}`), {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`deleteCollection failed: ${res.status} ${text}`);
  }
  return res.json();
}
