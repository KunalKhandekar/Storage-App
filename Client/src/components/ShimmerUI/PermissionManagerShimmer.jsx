
const ShimmerBox = ({ className = "", children }) => (
  <div className={`animate-pulse ${className}`}>
    {children}
  </div>
);

const ShimmerLine = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded ${className}`}></div>
);

const ShimmerCircle = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-full ${className}`}></div>
);

export default function PermissionManagerShimmer() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Enhanced Header Shimmer */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-sm">
            <ShimmerBox>
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* Back Button */}
                  <div className="p-2 sm:p-2.5 rounded-xl border border-gray-200">
                    <ShimmerLine className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    {/* Title Section */}
                    <div className="flex items-center gap-3 mb-1">
                      {/* Icon */}
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShimmerLine className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      </div>
                      {/* Title Text */}
                      <ShimmerLine className="h-4 sm:h-5 lg:h-6 w-44 sm:w-52 lg:w-56" />
                    </div>
                    {/* File Name Subtitle */}
                    <ShimmerLine className="h-3 sm:h-4 w-56 sm:w-64 lg:w-72 ml-11" />
                  </div>
                </div>
                
                {/* Right Side Stats */}
                <div className="flex items-center gap-4">
                  {/* Users Count Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <ShimmerLine className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <ShimmerLine className="h-3 sm:h-4 w-12 sm:w-16" />
                  </div>
                  {/* Last Updated */}
                  <div className="hidden sm:block">
                    <ShimmerLine className="h-3 w-24 lg:w-32" />
                  </div>
                </div>
              </div>
            </ShimmerBox>
          </div>

          {/* File Info Card Shimmer */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <ShimmerBox>
                <div className="flex items-center space-x-4">
                  <ShimmerCircle className="w-14 h-14" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <ShimmerLine className="h-4 lg:h-5 w-48 sm:w-64" />
                    <div className="flex items-center gap-3">
                      <ShimmerLine className="h-3 w-16" />
                      <ShimmerLine className="h-3 w-2" />
                      <ShimmerLine className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </ShimmerBox>
            </div>
          </div>

          {/* Link Sharing Card Shimmer */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <ShimmerBox>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <ShimmerLine className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <ShimmerLine className="h-4 lg:h-5 w-24 sm:w-32" />
                </div>
              </ShimmerBox>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <ShimmerBox>
                {/* Toggle Section */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <ShimmerCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                      <ShimmerLine className="h-4 w-32" />
                    </div>
                    <ShimmerLine className="h-3 w-48 sm:w-64 ml-6" />
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex-shrink-0">
                    <ShimmerLine className="h-6 w-11 rounded-full" />
                  </div>
                </div>

                {/* Link Section */}
                <div className="mt-6 space-y-4">
                  {/* Link Input and Copy Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ShimmerLine className="flex-1 h-12 rounded-lg" />
                    <ShimmerLine className="h-12 w-full sm:w-24 lg:w-28 rounded-lg" />
                  </div>

                  {/* Permission Badge */}
                  <div className="flex items-center gap-2 pt-2">
                    <ShimmerLine className="h-3 w-16" />
                    <ShimmerLine className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </ShimmerBox>
            </div>
          </div>

          {/* Shared Users Card Shimmer */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <ShimmerBox>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShimmerLine className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <ShimmerLine className="h-4 lg:h-5 w-28 sm:w-32" />
                  <ShimmerLine className="h-3 w-6" />
                </div>
              </ShimmerBox>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Shared Users List */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout Shimmer */}
                    <div className="block sm:hidden space-y-4">
                      <ShimmerBox>
                        <div className="flex items-start space-x-3">
                          <div className="p-2.5 bg-gray-50 rounded-lg">
                            <ShimmerCircle className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <ShimmerLine className="h-4 w-32 mb-2" />
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <ShimmerLine className="h-3 w-36" />
                              <ShimmerLine className="h-3 w-2" />
                              <ShimmerLine className="h-3 w-20" />
                            </div>
                            <div className="flex items-center justify-between">
                              <ShimmerLine className="h-5 w-16 rounded-full" />
                              <div className="flex items-center gap-2">
                                <ShimmerLine className="h-7 w-20 rounded-lg" />
                                <ShimmerLine className="h-7 w-7 rounded-lg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </ShimmerBox>
                    </div>

                    {/* Desktop Layout Shimmer */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between">
                      <ShimmerBox>
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <ShimmerCircle className="w-8 h-8" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <ShimmerLine className="h-4 lg:h-5 w-40" />
                              <ShimmerLine className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="flex items-center gap-4">
                              <ShimmerLine className="h-3 w-32" />
                              <ShimmerLine className="h-3 w-2" />
                              <ShimmerLine className="h-3 w-24" />
                            </div>
                          </div>
                        </div>
                      </ShimmerBox>
                      <ShimmerBox>
                        <div className="flex items-center gap-3">
                          <ShimmerLine className="h-8 w-28 rounded-lg" />
                          <ShimmerLine className="h-8 w-8 rounded-lg" />
                        </div>
                      </ShimmerBox>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}