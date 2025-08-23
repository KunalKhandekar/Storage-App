import {
  ArrowUpDown,
  ChevronDown,
  Clock,
  Folder,
  Grid,
  HardDrive,
  List,
  Search,
  SortAsc,
  SortDesc,
  Type,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import FileDetailsModal from "../../components/Modals/FileDetailsModal";
import Breadcrumb from "./Breadcrumb";
import ItemCard from "./ItemCard";

const DirectoryView = ({
  allItems = [],
  breadCrumb,
  activeDropdown,
  setActiveDropdown,
  setActionDone,
  setShowShareModal,
  setCurrentFile,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    item: null,
  });

  const filteredAndSortedItems = useMemo(() => {
    const filtered = allItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const multiplier = sortOrder === "asc" ? 1 : -1;

    filtered.sort((a, b) => {
      let aValue = "";
      let bValue = "";

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "size":
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case "modified":
          aValue = new Date(a.updatedAt || 0).getTime();
          bValue = new Date(b.updatedAt || 0).getTime();
          return (bValue - aValue) * multiplier;

        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return -1 * multiplier;
      if (aValue > bValue) return 1 * multiplier;
      return 0;
    });

    // Always show directories first
    return filtered.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return 0;
    });
  }, [allItems, searchTerm, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setShowSortDropdown(false);
  };

  const handleDetailsOpen = (item) => {
    setDetailsModal({ isOpen: true, item });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb breadCrumb={breadCrumb} />

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            {/* Left side - Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-1 lg:flex-none">
              {/* Search Input */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg transition-colors text-sm placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
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
            <div className="flex items-center gap-3">
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
                              <span className="text-gray-700">
                                {option.label}
                              </span>
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
                  {filteredAndSortedItems.length} result
                  {filteredAndSortedItems.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-medium text-gray-900">
                    "{searchTerm}"
                  </span>
                </p>
                {filteredAndSortedItems.length > 0 && (
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

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredAndSortedItems.length}{" "}
              {filteredAndSortedItems.length === 1 ? "item" : "items"}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Items Grid/List */}
          {filteredAndSortedItems.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 max-w-none"
                  : "space-y-2"
              }
            >
              {filteredAndSortedItems.map((item) => (
                <ItemCard
                  key={item._id || item.id}
                  item={item}
                  viewMode={viewMode}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  setActionDone={setActionDone}
                  setShowShareModal={setShowShareModal}
                  setCurrentFile={setCurrentFile}
                  onDetailsOpen={handleDetailsOpen}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No results found" : "No files or folders"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No items match "${searchTerm}". Try a different search term.`
                  : "Upload some files or create a directory to get started"}
              </p>
            </div>
          )}
        </div>

        {/* File Details Modal */}
        <FileDetailsModal
          item={detailsModal.item}
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ isOpen: false, item: null })}
        />
      </div>
    </div>
  );
};

export default DirectoryView;
