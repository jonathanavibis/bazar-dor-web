export default function Loading() {
  return (
    <div className="bg-[#f3f6f3]">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-11 h-11 bg-gray-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
            <div className="h-6 bg-gray-100 rounded w-1/2 mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}