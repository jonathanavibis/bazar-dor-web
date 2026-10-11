"use client";

// The "সাজান" dropdown used on the home and category pages.
export default function SortSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      সাজান
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm"
        >
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
        <svg
          className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" />
        </svg>
      </span>
    </label>
  );
}
