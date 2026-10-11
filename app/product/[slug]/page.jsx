import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductRaw } from "@/lib/product";
import { formatPct, formatPrice, toBn, toNum, unitLabel } from "@/lib/bn";

// The API field names for the per-market prices are not fixed, so we look for
// the common ones. If your API uses another name, add it to these lists.
const MARKET_KEYS = ["markets", "bazars", "bazaars", "marketPrices", "bazarPrices", "prices", "bazar", "market"];
const NAME_KEYS = ["nameBn", "name", "bazarName", "marketName", "market", "bazar", "label", "title"];
const PRICE_KEYS = ["price", "today", "value", "amount", "dam"];

const pick = (o, keys) => {
  for (const k of keys) {
    if (o?.[k] !== undefined && o?.[k] !== null && o?.[k] !== "") return o[k];
  }
  return undefined;
};

function extractMarkets(p) {
  let arr;
  for (const k of MARKET_KEYS) {
    if (Array.isArray(p?.[k]) && p[k].length) {
      arr = p[k];
      break;
    }
  }
  if (!arr) {
    arr = Object.values(p ?? {}).find(
      (v) => Array.isArray(v) && v.length && typeof v[0] === "object" && pick(v[0], PRICE_KEYS) !== undefined
    );
  }

  if (arr) {
    return arr
      .map((m) => ({
        name: String(pick(m, NAME_KEYS) ?? "বাজার"),
        price: toNum(pick(m, PRICE_KEYS)),
      }))
      .filter((m) => m.price > 0);
  }

  // an object like { "কারওয়ান বাজার": 148, ... }
  for (const k of MARKET_KEYS) {
    const v = p?.[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.entries(v)
        .map(([name, price]) => ({ name, price: toNum(price) }))
        .filter((m) => m.price > 0);
    }
  }
  return [];
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProductRaw(slug);
  if (!p) notFound();

  const markets = extractMarkets(p);
  const prices = markets.map((m) => m.price);
  const today = toNum(p.today ?? p.price);

  const min = toNum(p.min ?? p.minPrice) || (prices.length ? Math.min(...prices) : today);
  const max = toNum(p.max ?? p.maxPrice) || (prices.length ? Math.max(...prices) : today);
  const avg =
    toNum(p.avg ?? p.average ?? p.avgPrice) ||
    (prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : today);

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
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${color}`}>
        {formatPrice(value)} <span className="text-sm font-medium text-gray-500">টাকা</span>
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f3f6f3] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-green-700 hover:underline">
          ← হোম পেজে ফিরে যান
        </Link>

        {/* Summary */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
          <span className="w-20 h-20 shrink-0 flex items-center justify-center text-4xl bg-gray-50 rounded-2xl">
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
                <span key={t} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
              <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                {unitLabel(p.unit)}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-3xl font-extrabold text-gray-900">
              {formatPrice(today)} <span className="text-base font-medium">টাকা</span>
            </p>
            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
              {arrow} {formatPct(pct)}%
            </span>
          </div>
        </section>

        {/* Price summary */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stat("সর্বনিম্ন দাম", min, "text-green-700")}
          {stat("সর্বোচ্চ দাম", max, "text-red-600")}
          {stat("গড় দাম", avg, "text-gray-900")}
        </section>

        {/* Per-market prices */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">বাজারভিত্তিক আজকের দাম</h2>
          {markets.length === 0 ? (
            <p className="text-sm text-gray-500">বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4 font-medium">বাজার</th>
                    <th className="py-2 font-medium text-right">দাম</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 pr-4 text-gray-800">{m.name}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">
                        {formatPrice(m.price)} টাকা
                        {m.price === min && markets.length > 1 && (
                          <span className="ml-2 text-xs text-green-700">সর্বনিম্ন</span>
                        )}
                        {m.price === max && markets.length > 1 && (
                          <span className="ml-2 text-xs text-red-600">সর্বোচ্চ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4">মোট {toBn(markets.length)}টি বাজারের তথ্য</p>
        </section>
      </div>
    </main>
  );
}
