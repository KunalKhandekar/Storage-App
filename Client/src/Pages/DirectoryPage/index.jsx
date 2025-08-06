import { Folder } from "lucide-react";
import ShareModal from "../../components/Modals/ShareModal";
import CreateFolderModal from "./CreateModal";
import ItemCard from "./ItemCard";
import UploadSection from "./UploadSection";
import DirectoryShimmer from "../../components/ShimmerUI/DirectoryShimmer";
import useDirectory from "../../hooks/useDirectory";

const DirectoryPage = () => {
  const {
    allItems,
    currentPath,
    loading,
    showCreateModal,
    showShareModal,
    currentFile,
    activeDropdown,
    dirId,
    handleCreateModalClose,
    handleCreateSuccess,
    handleShareModalClose,
    handleDropdownClose,
    handleActionComplete,
    setCurrentPath,
    setActiveDropdown,
    setShowShareModal,
    setCurrentFile,
    setShowCreateModal
  } = useDirectory();

  if (loading) {
    return <DirectoryShimmer />;
  }

  return (
    <div className="min-h-fit max-w-7xl m-auto mt-3">
      {/* Main Content */}
      <main className="p-6 bg-gray-50 max-w-6xl mx-4 lg:m-auto rounded-lg shadow-sm border border-gray-200">
        {/* Upload Progress */}
        <UploadSection
          setShowCreateModal={setShowCreateModal}
          setActionDone={handleActionComplete}
        />

        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 pl-3.5 pb-3.5">
            Current Directory : {currentPath}
          </h1>
        </div>

        {/* Directory Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              setCurrentPath={setCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              setActionDone={handleActionComplete}
              setShowShareModal={setShowShareModal}
              setCurrentFile={setCurrentFile}
            />
          ))}
        </div>

        {allItems.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files or folders
            </h3>
            <p className="text-gray-500">
              Upload some files or create a directory to get started
            </p>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateFolderModal
          onClose={handleCreateModalClose}
          onCreate={handleCreateSuccess}
          dirId={dirId}
        />
      )}

      {showShareModal && (
        <ShareModal
          closeModal={handleShareModalClose}
          currentFile={currentFile}
        />
      )}

      {/* DropDown */}
      {activeDropdown && (
        <div className="fixed inset-0 z-10" onClick={handleDropdownClose} />
      )}
    </div>
  );
};

export default DirectoryPage;
