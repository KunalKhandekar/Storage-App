const DirectoryShimmer = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg p-6 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2" />
        <div className="h-3 bg-gray-200 rounded w-32 mx-auto mb-4" />
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <div className="h-10 bg-gray-300 rounded w-full sm:w-28" />
          <div className="h-10 bg-gray-300 rounded w-full sm:w-28" />
          <div className="h-10 bg-gray-300 rounded w-full sm:w-28" />
        </div>
      </div>

      {/* Directory Title */}
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-5" />

      {/* Grid Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                {index % 2 === 0 && (
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoryShimmer;
