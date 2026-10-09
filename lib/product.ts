import { toNum } from "./bn";

export type Product = {
  id: string | number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  image: string; // image URL from the API ("" if the API gives an emoji instead)
  icon: string;  // emoji fallback
  unit?: string;
  today: number;
  dir: "up" | "down" | "flat";
  pct: number;
};

const BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const looksLikeUrl = (s: string) =>
  /^(https?:)?\/\//.test(s) || s.startsWith("/") || s.startsWith("data:") ||
  /\.(png|jpe?g|webp|svg|gif|avif)(\?|$)/i.test(s);

export async function getProducts(category?: string): Promise<Product[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  let data: any = null;
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

  const raw: any[] = Array.isArray(data)
    ? data
    : data.products ?? Object.values(data).find(Array.isArray) ?? [];

  return raw.map((p) => {
    const candidates = [
      p.image, p.img, p.imageUrl, p.image_url, p.photo, p.thumbnail,
      p.picture, p.icon, p.emoji, p.categoryIcon,
    ]
      .map((v) => (typeof v === "string" ? v : v?.url))
      .filter((v): v is string => typeof v === "string" && v.trim() !== "")
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