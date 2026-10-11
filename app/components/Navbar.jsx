"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthMenu from "./AuthMenu";

function TickerSet({ items, hidden = false }) {
  const color = (t) =>
    t === "up" ? "text-red-600" : t === "down" ? "text-green-600" : "text-gray-500";

  return (
    <div className="flex items-center shrink-0 gap-8 px-4" aria-hidden={hidden}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className="font-medium text-gray-800">{item.text}</span>
          <span className={`font-semibold ${color(item.type)}`}>{item.change}</span>
        </div>
      ))}
    </div>
  );
}

export default function Navbar({ categories = [], tickerItems = [] }) {
  const pathname = usePathname();
  const [banglaDateStr, setBanglaDateStr] = useState("");
  const [showTicker, setShowTicker] = useState(true);

  // Bangla date under the logo
  useEffect(() => {
    const opts = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    try {
      setBanglaDateStr(
        new Intl.DateTimeFormat("bn-BD", { ...opts, calendar: "bengali" }).format(new Date())
      );
    } catch {
      setBanglaDateStr(new Intl.DateTimeFormat("bn-BD", opts).format(new Date()));
    }
  }, []);

  // the ticker shows only at the very top of the page
  useEffect(() => {
    const handleScroll = () => setShowTicker(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Row 1: logo + auth */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-10 h-10 flex items-center justify-center text-lg bg-green-700 text-white rounded-2xl shadow-sm">
            🛒
          </span>
          <div>
            <h1 className="text-xl font-bold text-green-700">বাজার দর</h1>
            <p className="text-xs text-gray-500">{banglaDateStr || "লোড হচ্ছে..."}</p>
          </div>
        </Link>

        <AuthMenu />
      </div>

      {/* Row 2: category links */}
      <nav className="border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-none">
        <ul className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 min-w-max">
          <li>
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
                pathname === "/"
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              🏠 হোম
            </Link>
          </li>
          {categories.map((cat) => {
            const slug = cat.slug ?? cat.id;
            const isActive = pathname === `/category/${slug}`;
            return (
              <li key={cat.id}>
                <Link
                  href={`/category/${slug}`}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Row 3: price ticker (hides after scrolling) */}
      {tickerItems.length > 0 && (
        <div
          className={`bg-gray-50 text-xs overflow-hidden shadow-inner border-gray-200 transition-all duration-300 ease-in-out ${
            showTicker ? "max-h-16 py-2 opacity-100 border-b" : "max-h-0 py-0 opacity-0"
          }`}
        >
          <div className="flex w-max animate-marquee whitespace-nowrap items-center">
            <TickerSet items={tickerItems} />
            <TickerSet items={tickerItems} hidden />
          </div>
        </div>
      )}
    </header>
  );
}
