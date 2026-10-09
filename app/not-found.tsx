import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-3">🛒</p>
      <h1 className="text-3xl font-extrabold text-gray-900">৪০৪ — পেজ পাওয়া যায়নি</h1>
      <p className="text-gray-500 mt-2 mb-6">আপনি যে পেজটি খুঁজছেন তা নেই।</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}