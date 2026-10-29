"use client";

import { useMemo, useState } from "react";
import { formatPrice, toBn } from "@/lib/bn";

export default function MarketPricesList({ markets, minPrice, maxPrice }) {
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique divisions
  const divisions = useMemo(() => {
    const set = new Set();
    markets.forEach((m) => {
      if (m.division) set.add(m.division);
    });
    return Array.from(set);
  }, [markets]);

  // Filter markets by division & search query
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const matchDivision =
        selectedDivision === "all" || m.division === selectedDivision;
      const matchSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.division.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDivision && matchSearch;
    });
  }, [markets, selectedDivision, searchQuery]);

  if (!markets || markets.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500 text-sm">
        বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters: Division pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Division pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedDivision("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              selectedDivision === "all"
                ? "bg-green-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            সকল ({toBn(markets.length)})
          </button>
          {divisions.map((div) => {
            const count = markets.filter((m) => m.division === div).length;
            const active = selectedDivision === div;
            return (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  active
                    ? "bg-green-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {div} ({toBn(count)})
              </button>
            );
          })}
        </div>

        {/* Search box */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বাজার বা বিভাগ খুঁজুন..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-green-600 focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table / List */}
      {filteredMarkets.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm">
          আপনার খোঁজা অনুযায়ী কোনো বাজারের তথ্য মেলেনি।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50 text-gray-600 border-b border-gray-200 font-medium">
                <th className="py-3 px-4">বাজারের নাম</th>
                <th className="py-3 px-3">বিভাগ</th>
                <th className="py-3 px-3 text-right">সর্বনিম্ন দর</th>
                <th className="py-3 px-3 text-right">সর্বোচ্চ দর</th>
                <th className="py-3 px-4 text-right">দামের রেঞ্জ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredMarkets.map((m, idx) => {
                const isOverallMin = m.min <= minPrice;
                const isOverallMax = m.max >= maxPrice;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-green-50/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-gray-400">📍</span>
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      {m.division ? (
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {m.division}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">
                      {formatPrice(m.min)} টাকা
                      {isOverallMin && (
                        <span className="ml-1.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          সর্বনিম্ন
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-red-600">
                      {formatPrice(m.max)} টাকা
                      {isOverallMax && (
                        <span className="ml-1.5 text-[10px] font-semibold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          সর্বোচ্চ
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-700">
                      {m.min === m.max ? (
                        <span>{formatPrice(m.min)} টাকা</span>
                      ) : (
                        <span>
                          {formatPrice(m.min)} – {formatPrice(m.max)} টাকা
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer count */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
        <span>
          দেখানো হচ্ছে {toBn(filteredMarkets.length)}টি বাজার
          {selectedDivision !== "all" && ` (${selectedDivision} বিভাগ)`}
        </span>
        <span>মোট {toBn(markets.length)}টি বাজারের তথ্য</span>
      </div>
    </div>
  );
}
