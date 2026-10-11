"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, useSession } from "@/lib/auth-client";
import SocialButtons from "../components/SocialButtons";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  // already signed in -> go home
  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  // proxy.js sends people here with ?redirected=1 from protected pages
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("redirected")) {
      toast.error("এই পেজ দেখতে আগে লগইন করুন", { id: "login-required" });
    }
  }, []);

  // Google/GitHub send the user back here with ?error=... when login fails
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error")) {
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে!", { id: "social-error" });
    }
  }, []);

  const fail = (msg) => {
    setError(msg);
    toast.error(msg);
  };

  const handleCredentialsSignIn = async (e) => {
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

  const handleSocialLogin = async (provider) => {
    setSocialLoading(true);
    setError("");
    const { error } = await signIn.social({
      provider,
      callbackURL: "/",
      newUserCallbackURL: "/",
      errorCallbackURL: "/signin",
    });
    // on success the browser is redirected to Google/GitHub, so we only get here on failure
    if (error) {
      console.error("Social login error:", error);
      setSocialLoading(false);
      fail("সোশ্যাল লগইন ব্যর্থ হয়েছে!");
    }
  };

  const input =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm";

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

        <SocialButtons onSocial={handleSocialLogin} disabled={socialLoading || loading} />

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
