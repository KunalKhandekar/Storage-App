import ShareModal from "../../components/Modals/ShareModal";
import DirectoryShimmer from "../../components/ShimmerUI/DirectoryShimmer";
import useDirectory from "../../hooks/useDirectory";
import DirectoryView from "./ai";
import CreateFolderModal from "./CreateModal";
import UploadSection from "./UploadSection";

const DirectoryPage = () => {
  const {
    allItems,
    loading,
    showCreateModal,
    showShareModal,
    currentFile,
    activeDropdown,
    dirId,
    breadCrumb,
    handleCreateModalClose,
    handleCreateSuccess,
    handleShareModalClose,
    handleDropdownClose,
    handleActionComplete,
    setCurrentPath,
    setActiveDropdown,
    setShowShareModal,
    setCurrentFile,
    setShowCreateModal,
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

        <DirectoryView
          activeDropdown={activeDropdown}
          setActionDone={handleActionComplete}
          setActiveDropdown={setActiveDropdown}
          setCurrentFile={setCurrentFile}
          setCurrentPath={setCurrentPath}
          setShowShareModal={setShowShareModal}
          allItems={allItems}
          breadCrumb={breadCrumb}
        />

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
