import React from 'react';

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

export default function SharedByMeShimmer() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header Shimmer */}
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
                      <div className="p-2 bg-green-100 rounded-lg">
                        <ShimmerLine className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      </div>
                      {/* Title Text */}
                      <ShimmerLine className="h-4 sm:h-5 lg:h-6 w-40 sm:w-48 lg:w-56" />
                    </div>
                    {/* Subtitle */}
                    <ShimmerLine className="h-3 sm:h-4 w-48 sm:w-64 lg:w-72 ml-11" />
                  </div>
                </div>
              </div>
            </ShimmerBox>
          </div>

          {/* Search Bar Shimmer */}
          <div className="relative w-full sm:max-w-lg">
            <ShimmerBox>
              <ShimmerLine className="h-10 sm:h-12 w-full rounded-xl" />
            </ShimmerBox>
          </div>

          {/* Files List Shimmer */}
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  {/* Mobile Layout Shimmer */}
                  <div className="block sm:hidden space-y-4">
                    <ShimmerBox>
                      {/* File Info */}
                      <div className="flex items-start space-x-3">
                        <ShimmerCircle className="w-11 h-11" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <ShimmerLine className="h-4 w-40 flex-1" />
                            <ShimmerLine className="h-5 w-12 rounded-full" />
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <ShimmerLine className="h-3 w-12" />
                            <ShimmerLine className="h-3 w-8" />
                            <ShimmerLine className="h-3 w-16" />
                          </div>
                        </div>
                      </div>
                    </ShimmerBox>

                    {/* Mobile Actions */}
                    <ShimmerBox>
                      <div className="flex items-center gap-2">
                        <ShimmerLine className="h-8 flex-1 rounded-lg" />
                        <ShimmerLine className="h-8 flex-1 rounded-lg" />
                      </div>
                    </ShimmerBox>
                  </div>

                  {/* Desktop Layout Shimmer */}
                  <div className="hidden sm:block">
                    <ShimmerBox>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <ShimmerCircle className="w-14 h-14" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <ShimmerLine className="h-4 lg:h-5 w-56" />
                              <ShimmerLine className="h-5 w-20 rounded-full" />
                            </div>
                            <div className="flex items-center gap-4">
                              <ShimmerLine className="h-3 w-16" />
                              <ShimmerLine className="h-3 w-2" />
                              <ShimmerLine className="h-3 w-20" />
                              <ShimmerLine className="h-3 w-2" />
                              <ShimmerLine className="h-3 w-24" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShimmerLine className="h-8 w-20 lg:w-24 rounded-lg" />
                          <ShimmerLine className="h-8 w-16 lg:w-20 rounded-lg" />
                        </div>
                      </div>
                    </ShimmerBox>
                  </div>

                  {/* Shared Users Preview Shimmer */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                    <ShimmerBox>
                      <div className="flex items-center justify-between mb-3">
                        <ShimmerLine className="h-3 w-20" />
                        <ShimmerLine className="h-3 w-16" />
                      </div>

                      {/* Mobile Shared Users */}
                      <div className="block sm:hidden space-y-2">
                        {[1, 2].map((user) => (
                          <div
                            key={user}
                            className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg"
                          >
                            <ShimmerCircle className="w-6 h-6" />
                            <div className="flex-1 min-w-0 space-y-1">
                              <ShimmerLine className="h-3 w-24" />
                              <ShimmerLine className="h-3 w-32" />
                            </div>
                            <ShimmerLine className="h-4 w-12 rounded" />
                          </div>
                        ))}
                        <div className="text-center py-2">
                          <ShimmerLine className="h-3 w-20 mx-auto" />
                        </div>
                      </div>

                      {/* Desktop Shared Users */}
                      <div className="hidden sm:flex sm:flex-wrap gap-3">
                        {[1, 2, 3].map((user) => (
                          <div
                            key={user}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl min-w-0"
                          >
                            <ShimmerCircle className="w-7 h-7" />
                            <div className="flex-1 min-w-0 space-y-1">
                              <ShimmerLine className="h-3 w-20" />
                              <ShimmerLine className="h-3 w-24" />
                            </div>
                            <ShimmerLine className="h-4 w-12 rounded" />
                          </div>
                        ))}
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
  );
}