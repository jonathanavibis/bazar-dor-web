import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductRaw } from "@/lib/product";
import { formatPct, formatPrice, toNum, unitLabel } from "@/lib/bn";
import MarketPricesList from "@/app/components/MarketPricesList";

function extractMarkets(p) {
  const raw =
    p?.markets ??
    p?.bazars ??
    p?.bazaars ??
    p?.marketPrices ??
    p?.bazarPrices ??
    [];

  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .map((m) => {
        const name = String(
          m?.market ??
            m?.marketName ??
            m?.bazar ??
            m?.bazarName ??
            m?.nameBn ??
            m?.name ??
            "বাজার"
        );
        const division = String(
          m?.division ?? m?.bibhag ?? m?.city ?? m?.region ?? ""
        );
        const min = toNum(m?.min ?? m?.minPrice ?? m?.price ?? m?.today ?? 0);
        const max = toNum(m?.max ?? m?.maxPrice ?? m?.price ?? m?.today ?? 0);
        const avg = Math.round((min + max) / 2) || min || max;
        return { name, division, min, max, avg };
      })
      .filter((m) => m.min > 0 || m.max > 0 || m.avg > 0);
  }

  // Fallback for object format { "কারওয়ান বাজার": 148, ... }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.entries(raw)
      .map(([name, price]) => {
        const val = toNum(price);
        return { name, division: "", min: val, max: val, avg: val };
      })
      .filter((m) => m.min > 0);
  }

  return [];
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProductRaw(slug);
  if (!p) notFound();

  const markets = extractMarkets(p);
  const today = toNum(p.today ?? p.price);

  const allMins = markets.map((m) => m.min).filter((v) => v > 0);
  const allMaxs = markets.map((m) => m.max).filter((v) => v > 0);
  const allAvgs = markets.map((m) => m.avg).filter((v) => v > 0);

  const min = allMins.length ? Math.min(...allMins) : today;
  const max = allMaxs.length ? Math.max(...allMaxs) : today;
  const avg = allAvgs.length
    ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length)
    : today;

  const pct = toNum(p.change?.pct);
  const dir = pct === 0 ? "flat" : p.change?.dir === "down" ? "down" : "up";
  const badge =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-500";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

  const icon = p.emoji ?? p.icon ?? p.categoryIcon ?? "🛒";
  const tags = [
    ...(Array.isArray(p.tags) ? p.tags : []),
    ...(p.categoryNameBn ? [p.categoryNameBn] : []),
  ].filter((t, i, a) => typeof t === "string" && a.indexOf(t) === i);

  const stat = (label, value, color) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${color}`}>
        {formatPrice(value)} <span className="text-sm font-medium text-gray-500">টাকা</span>
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f3f6f3] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-green-700 hover:underline">
          ← হোম পেজে ফিরে যান
        </Link>

        {/* Top Summary Card */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 sm:items-center shadow-xs">
          <span className="w-20 h-20 shrink-0 flex items-center justify-center text-4xl bg-gray-50 rounded-2xl border border-gray-100">
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-gray-900">{p.nameBn ?? p.name}</h1>
            {(p.description ?? p.summary ?? p.subtitle) && (
              <p className="text-sm text-gray-600 mt-1">
                {p.description ?? p.summary ?? p.subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                  {t}
                </span>
              ))}
              <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-200">
                {unitLabel(p.unit)}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <p className="text-xs text-gray-500 font-medium">আজকের গড় দাম</p>
            <p className="text-3xl font-extrabold text-gray-900">
              {formatPrice(today)} <span className="text-base font-medium">টাকা</span>
            </p>
            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
              {arrow} {formatPct(pct)}%
            </span>
          </div>
        </section>

        {/* Price summary: Min, Max, Avg */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stat("সর্বনিম্ন দাম", min, "text-emerald-700")}
          {stat("সর্বোচ্চ দাম", max, "text-red-600")}
          {stat("গড় দাম", avg, "text-gray-900")}
        </section>

        {/* Per-market prices */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>বাজারভিত্তিক আজকের দাম</span>
          </h2>
          <MarketPricesList
            markets={markets}
            minPrice={min}
            maxPrice={max}
          />
        </section>
      </div>
    </main>
  );
}
