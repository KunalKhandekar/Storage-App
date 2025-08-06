import { File, Folder } from "lucide-react";
import FilePreviewModal from "../../components/Modals/FilePreviewModal";
import Header from "../../components/AdminHeader";
import { ItemCard } from "./ItemCard";
import Breadcrumb from "./BreadCrumb";
import useAdminUserView from "../../hooks/useAdminUserView";

export const AdminUserView = () => {
  const {
    directories,
    files,
    loading,
    currentPath,
    targetUser,
    previewFile,
    hasDirectories,
    hasFiles,
    isEmpty,
    handleDirectoryClick,
    handleBreadcrumbClick,
    closeFilePreview,
    setPreviewFile,
  } = useAdminUserView();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Header currentUser={targetUser} goTo={"/users"} backTo={"Panel"} />

        <div className="mb-4">
          <Breadcrumb
            currentPath={currentPath}
            onBreadcrumbClick={handleBreadcrumbClick}
            homeLabel="Root"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Directories Section */}
          {hasDirectories && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                <Folder className="w-5 h-5 mr-2 text-blue-600" />
                Directories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {directories.map((directory) => (
                  <ItemCard
                    key={directory._id}
                    item={directory}
                    type="directory"
                    onClick={handleDirectoryClick}
                    setPreviewFile={setPreviewFile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          {hasFiles && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                <File className="w-5 h-5 mr-2 text-gray-600" />
                Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <ItemCard 
                    key={file._id} 
                    item={file} 
                    type="file"
                    setPreviewFile={setPreviewFile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {isEmpty && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                This directory is empty
              </h3>
              <p className="text-gray-500">No files or directories found</p>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={closeFilePreview}
        />
      )}
    </div>
  );
};