const DirectoryShimmer = () => {
  return (
    <div className="min-h-fit max-w-7xl m-auto mt-3">
      {/* Main Content */}
      <main className="p-6 bg-gray-50 max-w-6xl mx-4 lg:m-auto rounded-lg shadow-sm border border-gray-200">
        {/* Upload Section Shimmer */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-64 max-w-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 max-w-full mx-auto mb-6"></div>
            {/* Mobile: Stacked buttons, Desktop: Side by side */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="h-12 bg-blue-200 rounded-lg w-full sm:w-32"></div>
              <div className="h-12 bg-green-200 rounded-lg w-full sm:w-36"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full sm:w-40"></div>
            </div>
          </div>
        </div>

        {/* Current Directory Title Shimmer */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-7 bg-gray-200 rounded w-full max-w-sm animate-pulse"></div>
        </div>

        {/* Directory Items Grid Shimmer */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
          {/* Generate 6 shimmer cards for mobile, 8 for larger screens */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow animate-pulse"
            >
              {/* Mobile layout: Icon and name in a row, dropdown on right */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Icon placeholder */}
                  <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                  {/* Name and details */}
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    {/* Show file details only for some items */}
                    {index % 3 === 0 && (
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    )}
                  </div>
                </div>
                {/* Dropdown button placeholder */}
                <div className="w-6 h-6 bg-gray-200 rounded flex-shrink-0"></div>
              </div>
            </div>
          ))}
          
          {/* Additional cards for larger screens only */}
          <div className="hidden sm:block">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`extra-${index}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      {index === 0 && (
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      )}
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded flex-shrink-0"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating shimmer effect for visual appeal */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-pulse"></div>
        </div>
      </main>
    </div>
  );
};

export default DirectoryShimmer;