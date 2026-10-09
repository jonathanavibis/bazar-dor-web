const BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function getCategories() {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/categories`, { next: { revalidate: 300 } });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : data.categories ?? [];
      }
    } catch {}
  }
  return [];
}

export async function getCategory(slug: string) {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/categories/${encodeURIComponent(slug)}`, {
        next: { revalidate: 300 },
      });
      if (res.status === 404) return null;
      if (res.ok) {
        const data = await res.json();
        const c = data?.category ?? data;
        return c && typeof c === "object" && !Array.isArray(c) ? c : null;
      }
    } catch {}
  }
  return null;
}