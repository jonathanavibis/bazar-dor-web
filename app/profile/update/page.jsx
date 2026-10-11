"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient, useSession } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম লিখুন");
      return;
    }
    setLoading(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setLoading(false);
    if (error) {
      toast.error(error.message || "আপডেট করা যায়নি");
      return;
    }
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  };

  return (
    <main className="min-h-[70vh] bg-[#f3f6f3] py-12 px-4">
      <form
        onSubmit={handleUpdate}
        className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-4"
      >
        <h1 className="text-xl font-extrabold text-gray-900">তথ্য আপডেট করুন</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <button
          disabled={loading}
          className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-sm disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করুন..." : "আপডেট করুন"}
        </button>
      </form>
    </main>
  );
}
