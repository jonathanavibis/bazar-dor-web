"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp, signIn, useSession } from "@/lib/auth-client";
import SocialButtons from "../components/SocialButtons";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // already signed in -> go home
  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

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

  const handleCredentialsSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (password !== confirmPassword)
      return fail("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");

    setLoading(true);
    const { error } = await signUp.email({ email, password, name });
    setLoading(false);

    if (error) return fail(error.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে!");

    toast.success("রেজিস্ট্রেশন সফল! এখন লগইন করুন");
    router.push("/signin");
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(true);
    setError("");
    const { error } = await signIn.social({
      provider,
      callbackURL: "/",
      newUserCallbackURL: "/",
      errorCallbackURL: "/signup",
    });
    if (error) {
      console.error("Social login error:", error);
      setSocialLoading(false);
      fail("সোশ্যাল লগইন ব্যর্থ হয়েছে!");
    }
  };

  const input =
    "w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto flex items-center justify-center text-xl bg-green-700 text-white rounded-2xl shadow-sm">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-sm text-gray-500 mt-1">বাজার দর অ্যাপে রেজিস্টার করুন</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="পূর্ণ নাম" 
              className={input.replace("pr-10", "")} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              className={input.replace("pr-10", "")} 
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-sm focus:outline-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field with Show/Hide Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">কনফার্ম পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={input}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-sm focus:outline-none"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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

        <SocialButtons onSocial={handleSocialLogin} disabled={socialLoading || loading} />

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