import type { Metadata } from "next";
import { Noto_Serif_Bengali, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const noteSerifBengali = Noto_Serif_Bengali({
  variable: "--font-geist-mono",
  subsets: ["bengali","latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর - BazarDor",
  description: "Essential market prices in Bangladesh",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html
      lang="bn"
      className={`${noteSerifBengali.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
      {children}
      </body>
    </html>
  );
}