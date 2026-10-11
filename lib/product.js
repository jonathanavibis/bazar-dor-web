import { toNum } from "./bn";

const BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor", // alternative
];

const looksLikeUrl = (s) =>
  /^(https?:)?\/\//.test(s) ||
  s.startsWith("/") ||
  s.startsWith("data:") ||
  /\.(png|jpe?g|webp|svg|gif|avif)(\?|$)/i.test(s);

// Returns a normalized list of products (optionally for one category).
export async function getProducts(category) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  let data = null;
  let origin = "";

  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/products${qs}`, { next: { revalidate: 300 } });
      if (res.ok) {
        data = await res.json();
        origin = new URL(base).origin;
        break;
      }
    } catch {}
  }
  if (!data) throw new Error("প্রোডাক্ট ডেটা ফেচ করতে সমস্যা হয়েছে");

  const raw = Array.isArray(data)
    ? data
    : data.products ?? Object.values(data).find(Array.isArray) ?? [];

  return raw.map((p) => {
    // the picture can be an image URL or an emoji, depending on the field
    const candidates = [
      p.image, p.img, p.imageUrl, p.image_url, p.photo, p.thumbnail,
      p.picture, p.icon, p.emoji, p.categoryIcon,
    ]
      .map((v) => (typeof v === "string" ? v : v?.url))
      .filter((v) => typeof v === "string" && v.trim() !== "")
      .map((v) => v.trim());

    let image = candidates.find(looksLikeUrl) ?? "";
    if (image.startsWith("/") && !image.startsWith("//")) image = origin + image;
    const icon = candidates.find((v) => !looksLikeUrl(v)) ?? "🛒";

    const pct = toNum(p.change?.pct);
    const dir = pct === 0 ? "flat" : p.change?.dir === "down" ? "down" : "up";

    return {
      id: p.id,
      slug: String(p.slug ?? p.id),
      nameBn: p.nameBn ?? "নামবিহীন পণ্য",
      category: String(p.category ?? ""),
      categoryNameBn: p.categoryNameBn ?? "",
      image,
      icon,
      unit: p.unit,
      today: toNum(p.today),
      dir,
      pct,
    };
  });
}

// Returns the raw product object (used by the details page).
export async function getProductRaw(key) {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/products/${encodeURIComponent(key)}`, {
        next: { revalidate: 300 },
      });
      if (res.status === 404) break;
      if (res.ok) {
        const d = await res.json();
        const p = d?.product ?? d;
        if (p && typeof p === "object" && !Array.isArray(p)) return p;
      }
    } catch {}
  }

  // fallback: the slug may not be the id, so search the full list
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/products`, { next: { revalidate: 300 } });
      if (!res.ok) continue;
      const d = await res.json();
      const list = Array.isArray(d)
        ? d
        : d.products ?? Object.values(d).find(Array.isArray) ?? [];
      return list.find((x) => String(x.slug) === key || String(x.id) === key) ?? null;
    } catch {}
  }
  return null;
}
