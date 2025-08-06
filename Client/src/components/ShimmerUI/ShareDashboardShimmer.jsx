const ShimmerBox = ({ className = "", children }) => (
  <div className={`animate-pulse ${className}`}>{children}</div>
);

const ShimmerLine = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded ${className}`}></div>
);

const ShimmerCircle = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-full ${className}`}></div>
);

export default function DashboardShimmer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Shimmer */}
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-3">
                <ShimmerBox>
                  <ShimmerLine className="h-6 sm:h-8 lg:h-9 w-80 max-w-full" />
                </ShimmerBox>
                <ShimmerBox>
                  <ShimmerLine className="h-3 sm:h-4 w-64 max-w-full" />
                </ShimmerBox>
              </div>
              <ShimmerBox>
                <ShimmerLine className="h-4 w-32" />
              </ShimmerBox>
            </div>
          </div>

          {/* Stats Cards Shimmer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <ShimmerBox>
                <div className="flex items-center justify-between mb-4">
                  <ShimmerCircle className="w-12 h-12" />
                  <ShimmerLine className="h-8 w-12" />
                </div>
                <div className="mb-4 space-y-2">
                  <ShimmerLine className="h-4 w-32" />
                  <ShimmerLine className="h-3 w-40" />
                </div>
                <ShimmerLine className="h-9 w-full rounded-xl" />
              </ShimmerBox>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <ShimmerBox>
                <div className="flex items-center justify-between mb-4">
                  <ShimmerCircle className="w-12 h-12" />
                  <ShimmerLine className="h-8 w-12" />
                </div>
                <div className="mb-4 space-y-2">
                  <ShimmerLine className="h-4 w-28" />
                  <ShimmerLine className="h-3 w-36" />
                </div>
                <ShimmerLine className="h-9 w-full rounded-xl" />
              </ShimmerBox>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:col-span-2 lg:col-span-1">
              <ShimmerBox>
                <div className="flex items-center justify-between mb-4">
                  <ShimmerCircle className="w-12 h-12" />
                  <div className="text-right space-y-1">
                    <ShimmerLine className="h-8 w-12 ml-auto" />
                    <ShimmerLine className="h-3 w-16 ml-auto" />
                  </div>
                </div>
                <div className="space-y-2">
                  <ShimmerLine className="h-4 w-24" />
                  <ShimmerLine className="h-3 w-32" />
                </div>
              </ShimmerBox>
            </div>
          </div>

          {/* Recent Activity Shimmer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <ShimmerBox>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <ShimmerLine className="h-5 sm:h-6 w-40" />
                    <ShimmerLine className="h-3 sm:h-4 w-64" />
                  </div>
                </div>
              </ShimmerBox>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-4">
                {/* Recent File Items Shimmer */}
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50/30"
                  >
                    <ShimmerBox>
                      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                        <ShimmerCircle className="w-8 h-8" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <ShimmerLine className="h-4 w-48 max-w-full" />
                          <ShimmerLine className="h-3 w-64 max-w-full" />
                        </div>
                      </div>
                    </ShimmerBox>

                    <ShimmerBox>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <ShimmerLine className="h-3 w-16" />
                        <ShimmerLine className="h-8 w-20 rounded-lg" />
                      </div>
                    </ShimmerBox>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Shimmer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <ShimmerBox>
                <div className="space-y-2">
                  <ShimmerLine className="h-5 sm:h-6 w-32" />
                  <ShimmerLine className="h-3 sm:h-4 w-48" />
                </div>
              </ShimmerBox>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Quick Action 1 */}
                <div className="flex items-center space-x-4 p-4 sm:p-6 border border-gray-100 rounded-xl bg-gradient-to-r from-white to-blue-50/30">
                  <ShimmerBox>
                    <ShimmerCircle className="w-12 h-12" />
                  </ShimmerBox>
                  <ShimmerBox>
                    <div className="flex-1 min-w-0 space-y-2">
                      <ShimmerLine className="h-4 w-32" />
                      <ShimmerLine className="h-3 w-48" />
                    </div>
                  </ShimmerBox>
                  <ShimmerBox>
                    <ShimmerCircle className="w-5 h-5" />
                  </ShimmerBox>
                </div>

                {/* Quick Action 2 */}
                <div className="flex items-center space-x-4 p-4 sm:p-6 border border-gray-100 rounded-xl bg-gradient-to-r from-white to-green-50/30">
                  <ShimmerBox>
                    <ShimmerCircle className="w-12 h-12" />
                  </ShimmerBox>
                  <ShimmerBox>
                    <div className="flex-1 min-w-0 space-y-2">
                      <ShimmerLine className="h-4 w-28" />
                      <ShimmerLine className="h-3 w-52" />
                    </div>
                  </ShimmerBox>
                  <ShimmerBox>
                    <ShimmerCircle className="w-5 h-5" />
                  </ShimmerBox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
