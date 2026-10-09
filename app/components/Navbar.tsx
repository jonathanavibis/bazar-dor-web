"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";
import AuthMenu from "./AuthMenu";

interface Category {
  id: string;
  slug?: string;
  nameBn: string;
  icon: string;
}

interface TickerItem {
  text: string;
  change: string;
  type: "up" | "down" | "flat";
}

export default function Navbar({
  categories,
  tickerItems,
}: {
  categories: Category[];
  tickerItems: TickerItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [banglaDateStr, setBanglaDateStr] = useState("");
  const [showTicker, setShowTicker] = useState(true);

  useEffect(() => {
    try {
      const formatter = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        calendar: "bengali",
      });
      setBanglaDateStr(formatter.format(new Date()));
    } catch {
      setBanglaDateStr(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date())
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTicker(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে লগআউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: () => toast.error("লগআউট করতে সমস্যা হয়েছে"),
      },
    });
  };

  const color = (t: TickerItem["type"]) =>
    t === "up" ? "text-red-600" : t === "down" ? "text-green-600" : "text-gray-500";

  const TickerSet = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex items-center shrink-0 gap-8 px-4" aria-hidden={hidden}>
      {tickerItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className="font-medium text-gray-800">{item.text}</span>
          <span className={`font-semibold ${color(item.type)}`}>{item.change}</span>
        </div>
      ))}
    </div>
  );

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

        <div className="flex items-center gap-2 sm:gap-3">
          {isPending ? (
            <div className="w-24 h-8 bg-gray-100 rounded-md animate-pulse" />
          ) : session ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3">
                   <AuthMenu />
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
              >
                লগআউট
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-3 sm:px-4 py-1.5 text-sm font-medium text-green-700 border border-green-600 rounded-md hover:bg-green-50 transition"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="px-3 sm:px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Row 2: categories */}
      <nav className="border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-none">
        <ul className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 min-w-max">
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

      {/* Row 3: ticker (hides when scrolled) */}
      {tickerItems.length > 0 && (
        <div
          className={`bg-gray-50 text-xs overflow-hidden shadow-inner border-gray-200 transition-all duration-300 ease-in-out ${
            showTicker ? "max-h-16 py-2 opacity-100 border-b" : "max-h-0 py-0 opacity-0"
          }`}
        >
          <div className="flex w-max animate-marquee whitespace-nowrap items-center">
            <TickerSet />
            <TickerSet hidden />
          </div>
        </div>
      )}
    </header>
  );
}