import Link from "next/link";
import { formatPct, formatPrice, unitLabel } from "@/lib/bn";
import type { Product } from "@/lib/products";

const BADGE = {
  up:   { cls: "bg-red-50 text-red-600",     arrow: "▲" },
  down: { cls: "bg-green-50 text-green-700", arrow: "▼" },
  flat: { cls: "bg-gray-100 text-gray-500",  arrow: "—" },
};

export default function ProductCard({ p }: { p: Product }) {
  const b = BADGE[p.dir];
  return (
    <Link
      href={`/product/${p.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-green-600 hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 shrink-0 flex items-center justify-center text-2xl bg-gray-50 rounded-lg">
          {p.icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{p.nameBn}</h3>
          <p className="text-xs text-gray-500">{unitLabel(p.unit)}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">আজকের দাম</p>
      <div className="flex items-end justify-between">
        <span className="text-xl font-extrabold text-gray-900">
          {formatPrice(p.today)} <span className="text-sm font-medium">টাকা</span>
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.cls}`}>
          {b.arrow} {formatPct(p.pct)}%
        </span>
      </div>
    </Link>
  );
}