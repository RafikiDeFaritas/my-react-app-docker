const BASE = import.meta.env.VITE_API_BASE || "";
export async function fetchJSON(path, init) {
  const url = path.startsWith("http") ? path : BASE + path;
  const res = await fetch(url, init);
  const raw = await res.text();
  let data = null;
  if (raw) { try { data = JSON.parse(raw); } catch {} }
  if (!res.ok) throw new Error((data && data.error) || `HTTP ${res.status}`);
  return data;
}
