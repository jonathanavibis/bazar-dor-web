"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [banglaDateStr, setBanglaDateStr] = useState("");
  const [showTicker, setShowTicker] = useState(true); // স্ক্রল ট্র্যাক করার জন্য স্টেট

  useEffect(() => {
    const toBanglaNumber = (num: number) => {
      const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return num
        .toString()
        .split("")
        .map((digit) => bnDigits[parseInt(digit)] || digit)
        .join("");
    };

    const today = new Date();

    try {
      const formatter = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        calendar: "bengali",
      });
      setBanglaDateStr(formatter.format(today));
    } catch {
      const day = toBanglaNumber(today.getDate());
      const year = toBanglaNumber(today.getFullYear() - 593);
      const monthsBn = [
        "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
        "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
      ];
      const weekdaysBn = [
        "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
      ];
      const weekday = weekdaysBn[today.getDay()];
      const month = monthsBn[today.getMonth() % 12];
      setBanglaDateStr(`${weekday}, ${day} ${month} ${year}`);
    }
  }, []);

  // স্ক্রল হ্যান্ডলার: পেজ একদম উপরে (scrollY === 0) থাকলে টিকার দেখাবে, নিচে নামলে লুকিয়ে যাবে
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowTicker(true);
      } else {
        setShowTicker(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("https://api.abcz.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const tickerItems = [
    { text: "🍚 স্বর্ণমাছি চাল: ১৪৮ টাকা/কেজি", change: "▲ ২.১%", type: "up" },
    { text: "🥔 আলু: ৫৫ টাকা/কেজি", change: "▼ ১.৫%", type: "down" },
    { text: "🧅 পেঁয়াজ: ১১০ টাকা/কেজি", change: "▲ ৩.০%", type: "up" },
    { text: "🐟 ইলিশ মাছ: ১,২৫০ টাকা/কেজি", change: "— ০.০%", type: "flat" },
    { text: "🫘 মসুর ডাল: ১৪০ টাকা/কেজি", change: "▲ ১.২%", type: "up" },
    { text: "🛢️ সয়াবিন তেল: ১৭৫ টাকা/লিটার", change: "▲ ০.৮%", type: "up" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Main Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-10 h-10 flex items-center justify-center text-lg bg-green-700 text-white rounded-2xl shadow-sm">🛒</span>
          <div>
            <h1 className="text-xl font-bold text-green-700 flex items-center gap-2">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500">{banglaDateStr || "লোড হচ্ছে..."}</p>
          </div>
        </Link>

        {/* Auth Buttons / User State */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-green-600">
                প্রোফাইল
              </Link>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/signin" 
                className="px-4 py-1.5 text-sm font-medium text-green-700 border border-green-600 rounded-md hover:bg-green-50 transition"
              >
                সাইন ইন
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Second Row: Category Navigation Links */}
      <nav className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto scrollbar-none border-b border-gray-100 bg-gray-50/50">
        <ul className="flex items-center gap-3 min-w-max">
          <li>
            <Link 
              href="/"
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
                pathname === "/" ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              🏠 হোম
            </Link>
          </li>
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
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

      {/* Third Row: Price Ticker / Marquee (স্ক্রল করলে হাইড হবে, টপে আসলে দেখাবে) */}
      <div 
        className={`bg-gray-50 text-xs overflow-hidden shadow-inner border-b border-gray-200 transition-all duration-300 ease-in-out ${
          showTicker ? "max-h-16 py-2 opacity-100" : "max-h-0 py-0 opacity-0 border-b-0"
        }`}
      >
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {/* প্রথম সেট */}
          <div className="flex items-center shrink-0 gap-8 px-4">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="font-medium text-gray-800">{item.text}</span>
                <span
                  className={`font-semibold ${
                    item.type === "up"
                      ? "text-red-600"
                      : item.type === "down"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
          {/* লুপ স্মুথ রাখার জন্য ডুপ্লিকেট সেট */}
          <div className="flex items-center shrink-0 gap-8 px-4" aria-hidden="true">
            {tickerItems.map((item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-1.5">
                <span className="font-medium text-gray-800">{item.text}</span>
                <span
                  className={`font-semibold ${
                    item.type === "up"
                      ? "text-red-600"
                      : item.type === "down"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}