"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
// যদি আপনার প্রজেক্টে BetterAuth ক্লায়েন্ট কনফিগার করা থাকে, তবে সেটি এখানে ইমপোর্ট করবেন:
// import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // এখানে BetterAuth এর সাইন-আপ ফাংশন কল হবে। যেমন:
      // const { data, error } = await authClient.signUp.email({ email, password, name });
      
      // সিম্যুলেশন বা রিয়েল ইমপ্লিমেন্টেশনের জন্য:
      // if (error) { toast.error(error.message); return; }

      toast.success("সফলভাবে রেজিস্টার সম্পন্ন হয়েছে!");
      router.push("/signin"); // সফল হলে সাইন ইন পেজে পাঠাবে[cite: 3]
    } catch (err: any) {
      toast.error(err?.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      // BetterAuth সোশ্যাল সাইন-ইন
      // await authClient.signIn.social({ provider });
      toast.success(`${provider.toUpperCase()} দিয়ে সফলভাবে লগইন হয়েছে!`);
      router.push("/");
    } catch (err: any) {
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-3xl">🛒</span>
          <h2 className="text-2xl font-bold text-green-700 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-sm text-gray-500 mt-1">বাজার দর প্রজেক্টে আপনাকে স্বাগতম</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="সম্পূর্ণ নাম লিখুন"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেল ঠিকানা</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition shadow-sm text-sm"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন আপ"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">অথবা</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <span>🌐</span> Google
          </button>
          <button
            onClick={() => handleSocialLogin("github")}
            className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <span>🐙</span> GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-green-600 font-medium hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}