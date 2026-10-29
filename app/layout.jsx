import "./globals.css";
import { Noto_Sans_Bengali } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/product";
import { formatPct, formatPrice, unitLabel } from "@/lib/bn";

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata = {
  title: "বাজার দর — আজকের বাজারের দাম এক নজরে",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের দাম এবং দামের পরিবর্তন এক জায়গায়।",
  // Stops Chrome's Google Translate from rewriting <html lang="bn"> into
  // lang="en" class="translated-ltr" (that rewrite breaks hydration).
  other: { google: "notranslate" },
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();
  const products = await getProducts().catch(() => []);

  // data for the scrolling price ticker under the navbar
  const tickerItems = products.map((p) => ({
    text: `${p.icon} ${p.nameBn}: ${formatPrice(p.today)} টাকা/${unitLabel(p.unit).replace("প্রতি ", "")}`,
    change: `${p.dir === "up" ? "▲" : p.dir === "down" ? "▼" : "—"} ${formatPct(p.pct)}%`,
    type: p.dir,
  }));

  return (
    // Browser extensions (Google Translate, Webex, Grammarly, ...) add
    // attributes like lang="en", class="translated-ltr" or
    // cz-shortcut-listen="true" before React hydrates. Those are not our
    // attributes, so React is told to ignore them on <html>/<body>.
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${bengali.className} min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Navbar categories={categories} tickerItems={tickerItems} />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
