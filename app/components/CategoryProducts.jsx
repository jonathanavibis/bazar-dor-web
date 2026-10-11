"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import SortSelect from "./SortSelect";

// Product grid + sort control for the category page.
export default function CategoryProducts({ products }) {
  const [sort, setSort] = useState("default");

  const list = useMemo(() => {
    const a = [...products];
    if (sort === "asc") a.sort((x, y) => x.today - y.today);
    if (sort === "desc") a.sort((x, y) => y.today - x.today);
    return a;
  }, [products, sort]);

  return (
    <>
      <div className="flex justify-end mb-4">
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
