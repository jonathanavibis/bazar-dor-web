"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

export default function AuthMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close the popup when clicking outside or pressing Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে লগআউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: () => toast.error("লগআউট করতে সমস্যা হয়েছে"),
      },
    });
  };

  if (isPending) {
    return <div className="w-28 h-9 bg-gray-100 rounded-full animate-pulse" />;
  }

  // signed out: show the two buttons
  if (!session) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/signin"
          className="px-3 sm:px-4 py-1.5 text-sm font-medium text-green-700 border border-green-600 rounded-md hover:bg-green-50 transition"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="px-3 sm:px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  // signed in: name + avatar + popup
  const user = session.user;
  const initial = (user.name?.trim()?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            {initial}
          </span>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-800 max-w-[120px] truncate">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            👤 আমার প্রোফাইল
          </Link>
          <button
            onClick={handleSignOut}
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            🚪 সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}