import {
  ArrowUpDown,
  ChevronDown,
  Clock,
  Grid,
  HardDrive,
  List,
  Search,
  SortAsc,
  SortDesc,
  Type,
  X,
} from "lucide-react";
import { useState } from "react";

const ToolBar = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  itemCount,
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setShowSortDropdown(false);
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-2">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side - Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1 lg:flex-none">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-[1024px]:w-80  pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg transition-colors text-sm placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right side - View Controls */}
        <div className="flex items-center justify-end gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium bg-white"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">Sort by</span>
              <span className="text-gray-600 capitalize">{sortBy}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  showSortDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Sort by
                  </div>
                  {[
                    { key: "name", label: "Name", icon: Type },
                    { key: "size", label: "Size", icon: HardDrive },
                    { key: "modified", label: "Modified", icon: Clock },
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.key}
                        onClick={() => handleSort(option.key)}
                        className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          <span className="text-gray-700">{option.label}</span>
                        </div>
                        {sortBy === option.key && (
                          <div className="flex items-center gap-1">
                            {sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4 text-blue-500" />
                            ) : (
                              <SortDesc className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Summary */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {itemCount} result
              {itemCount !== 1 ? "s" : ""} for{" "}
              <span className="font-medium text-gray-900">"{searchTerm}"</span>
            </p>
            {itemCount > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolBar;
