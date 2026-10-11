// Skeleton shown while the home page data is loading
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f3f6f3] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-64 bg-white border border-gray-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
            >
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
    </main>
  );
}
