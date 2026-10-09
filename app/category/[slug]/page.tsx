import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryProducts from "../../components/CategoryProducts";
import { getProducts } from "@/lib/product";
import { getCategory } from "@/lib/categories";
import { toBn } from "@/lib/bn";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProducts(slug).catch(() => []),
  ]);

  if (!category && products.length === 0) notFound();

  const title = category?.nameBn ?? products[0]?.categoryNameBn ?? slug;
  const icon = category?.icon ?? category?.emoji ?? "🛒";

  return (
    <main className="min-h-screen bg-[#f3f6f3] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-12 h-12 flex items-center justify-center text-2xl bg-white border border-gray-200 rounded-xl">
            {icon}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">
              মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>
        </div>

        <div className="mt-6">
          {products.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl text-center py-16 px-4">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-gray-700 font-medium mb-5">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          ) : (
            <CategoryProducts products={products} />
          )}
        </div>
      </div>
    </main>
  );
}