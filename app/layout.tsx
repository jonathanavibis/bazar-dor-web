import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/product";
import { formatPct, formatPrice, unitLabel } from "@/lib/bn";
import Footer from "./components/Footer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const products = await getProducts().catch(() => []);

  const tickerItems = products.map((p) => ({
    text: `${p.icon} ${p.nameBn}: ${formatPrice(p.today)} টাকা/${unitLabel(p.unit).replace("প্রতি ", "")}`,
    change: `${p.dir === "up" ? "▲" : p.dir === "down" ? "▼" : "—"} ${formatPct(p.pct)}%`,
    type: p.dir,
  }));

  return (
    <html lang="bn">
      <body>
        <Navbar categories={categories} tickerItems={tickerItems} />
        {children}
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}