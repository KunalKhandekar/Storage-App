import ShareModal from "../../components/Modals/ShareModal";
import DirectoryShimmer from "../../components/ShimmerUI/DirectoryShimmer";
import useDirectory from "../../hooks/useDirectory";
import DirectoryView from "./DirectoryView";
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

  return (
    <div className="m-auto">
      {/* Main Content */}
      <main className="min-h-screen p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        {/* Upload Progress */}
        <UploadSection
          setShowCreateModal={setShowCreateModal}
          setActionDone={handleActionComplete}
        />

        <DirectoryView
          loading={loading}
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
