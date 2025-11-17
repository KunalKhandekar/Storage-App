import { Folder } from "lucide-react";
import { useMemo, useState } from "react";
import FileDetailsModal from "../../components/Modals/FileDetailsModal";
import Breadcrumb from "./Breadcrumb";
import ItemCard from "./ItemCard";
import ToolBar from "./ToolBar";

const DirectoryView = ({
  loading,
  allItems = [],
  breadCrumb,
  activeDropdown,
  setActiveDropdown,
  setActionDone,
  setShowShareModal,
  setCurrentFile,
}) => {
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    item: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("view") || "grid"
  );
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleViewMode = (view) => {
    localStorage.setItem("view", view);
    setViewMode(view);
  };

  const filteredAndSortedItems = useMemo(() => {
    const filtered = allItems.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const multiplier = sortOrder === "asc" ? 1 : -1;

    const getKey = (item) => {
      switch (sortBy) {
        case "size":
          return item.size ?? 0;
        case "modified":
          return new Date(item.updatedAt ?? 0).getTime();
        default:
          return (item.name ?? "").toLowerCase();
      }
    };

    return [...filtered].sort((a, b) => {
      // 1) Directories first
      const aDir = a.type === "directory";
      const bDir = b.type === "directory";
      if (aDir !== bDir) return aDir ? -1 : 1;

      // 2) Then by selected key
      const aKey = getKey(a);
      const bKey = getKey(b);

      if (aKey < bKey) return -1 * multiplier;
      if (aKey > bKey) return 1 * multiplier;
      return 0;
    });
  }, [allItems, searchTerm, sortBy, sortOrder]);

  const handleDetailsOpen = (item) => {
    setDetailsModal({ isOpen: true, item });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb breadCrumb={breadCrumb} />

        {/* ToolBar -> Searching/Sorting/viewing */}
        <ToolBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={handleViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          itemCount={filteredAndSortedItems.length}
        />

        {/* Content */}
        {/* Items Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          </div>
        ) : filteredAndSortedItems.length > 0 ? (
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
