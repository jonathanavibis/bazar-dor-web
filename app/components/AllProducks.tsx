"use client";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { toBn } from "@/lib/bn";
import type { Product } from "@/lib/products";

export default function AllProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");

  const list = useMemo(() => {
    const a = [...products];
    if (sort === "asc") a.sort((x, y) => x.today - y.today);
    if (sort === "desc") a.sort((x, y) => y.today - x.today);
    return a;
  }, [products, sort]);

  return (
    <section id="সব-পণ্য" className="scroll-mt-32">
      <h2 className="text-xl font-extrabold text-gray-900">সব পণ্য</h2>
      <div className="flex items-center justify-between mt-1 mb-4">
        <p className="text-sm text-gray-500">মোট {toBn(list.length)}টি পণ্য দেখানো হচ্ছে</p>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          সাজান
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" />
            </svg>
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}