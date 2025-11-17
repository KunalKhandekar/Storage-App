import { ChevronDown, Filter, Search } from "lucide-react";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  getFilterCount,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="sm:w-4 sm:h-4 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search files or people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder:text-gray-400"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none w-full sm:w-auto px-4 py-2.5 sm:py-3 pr-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium text-gray-700"
          >
            <option value="all">All Files ({getFilterCount("all")})</option>
            <option value="viewer">
              View Only ({getFilterCount("viewer")})
            </option>
            <option value="editor">
              Can Edit ({getFilterCount("editor")})
            </option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Filter Pills - Mobile */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-2">
        {["all", "viewer", "editor"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              filter === filterType
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter size={10} />
            {filterType === "all"
              ? "All"
              : filterType === "viewer"
              ? "View Only"
              : "Can Edit"}
            <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
              {getFilterCount(filterType)}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default SearchAndFilter;
