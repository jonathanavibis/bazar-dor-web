"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import SortSelect from "./SortSelect";
import { toBn } from "@/lib/bn";

// Section C on the home page: every product, with the sort control.
export default function AllProducts({ products }) {
  const [sort, setSort] = useState("default");

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
        <p className="text-sm text-gray-500">
          মোট {toBn(list.length)}টি পণ্য দেখানো হচ্ছে
        </p>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
