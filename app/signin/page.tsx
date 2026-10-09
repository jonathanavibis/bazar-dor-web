"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, useSession } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  // the proxy/middleware sends people here with ?redirected=1
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("redirected")) {
      toast.error("এই পেজ দেখতে আগে লগইন করুন", { id: "login-required" });
    }
  }, []);

  const fail = (msg: string) => {
    setError(msg);
    toast.error(msg);
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn.email({ email, password });
    setLoading(false);

    if (error) return fail(error.message || "ইমেইল বা পাসওয়ার্ড ভুল!");

    toast.success("সফলভাবে লগইন হয়েছে");
    router.push("/");
    router.refresh();
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    const { error } = await signIn.social({ provider, callbackURL: "/" });
    if (error) fail("সোশ্যাল লগইন ব্যর্থ হয়েছে!");
  };

  const input =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm";
  const socialBtn =
    "w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto flex items-center justify-center text-xl bg-green-700 text-white rounded-2xl shadow-sm">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">বাজার দরে স্বাগতম</h2>
          <p className="text-sm text-gray-500 mt-1">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={input} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
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
          <button type="button" onClick={() => handleSocialLogin("google")} className={socialBtn}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.3-1.5-.3-2.3s.1-1.6.3-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9c-.3-.8-.5-1.9-.5-3.2z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z" />
            </svg>
            গুগল
          </button>
          <button type="button" onClick={() => handleSocialLogin("github")} className={socialBtn}>
            গিটহ্যাব
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          কোনো অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-green-600 font-medium hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}