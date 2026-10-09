import Image from "next/image";
import ProductCard from "./components/ProductCard";
import AllProducts from "./components/AllProducks";
import { getProducts } from "@/lib/product";
import TodayDate from "./components/TodayDate";

export default async function HomePage() {
  let products;
  try {
    products = await getProducts();
  } catch (e: any) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-red-500 font-medium">
        {e.message}
      </main>
    );
  }

  const risers = products.filter((p) => p.dir === "up").sort((a, b) => b.pct - a.pct).slice(0, 6);
  const fallers = products.filter((p) => p.dir === "down").sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f3f6f3] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3.5 py-1 rounded-full text-xs font-medium">
                <span>📅</span> <TodayDate />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                আজকের বাজারের দাম এক নজরে
              </h1>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
                সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
              </p>
              <div className="pt-2">
                <a
                  href="#সব-পণ্য"
                  className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-sm text-sm"
                >
                  সব পণ্য দেখুন
                </a>
              </div>
            </div>
            <div className="relative w-full h-56 md:h-80 order-1 md:order-2">
              <Image src="/bazar-hero.png" alt="Bazar Basket" fill className="object-contain" priority />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">
            <span className="text-red-600 text-sm mr-2">▲</span>আজ দাম বেড়েছে
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {risers.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">
            <span className="text-green-600 text-sm mr-2">▼</span>আজ দাম কমেছে
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fallers.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        <AllProducts products={products} />
      </div>
    </main>
  );
}