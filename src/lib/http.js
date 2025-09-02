
export async function fetchJSON(input, init) {
    const res = await fetch(input, init);
    const raw = await res.text();
    let data = null;
    if (raw) { try { data = JSON.parse(raw); } catch {} }
    if (!res.ok) throw new Error((data && data.error) || `HTTP ${res.status}`);
    return data;
  }
  