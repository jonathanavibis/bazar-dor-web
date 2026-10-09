"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="max-w-md mx-auto mt-16 h-48 bg-gray-100 rounded-2xl animate-pulse" />;
  }
  if (!session) return null; // middleware redirects signed-out users

  const user = session.user;
  return (
    <main className="min-h-[70vh] bg-[#f3f6f3] py-12 px-4">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <span className="w-20 h-20 mx-auto rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
          {(user.name?.[0] ?? "U").toUpperCase()}
        </span>
        <h1 className="text-xl font-extrabold text-gray-900 mt-4">{user.name}</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
        <Link
          href="/profile/update"
          className="inline-block mt-6 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
        >
          তথ্য আপডেট করুন
        </Link>
      </div>
    </main>
  );
}