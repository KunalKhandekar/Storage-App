import { AlertCircle, Loader2 } from "lucide-react";
import FileInfo from "./FileInfo";
import Header from "./Header";
import LinkSharingCard from "./LinkSharingCard";
import SharedUsers from "./SharedUsers";
import PermissionManagerShimmer from "../../../components/ShimmerUI/PermissionManagerShimmer";
import { usePermissionManager } from "../../../hooks/usePermissionManager";

export default function PermissionManager() {
  const {
    // States
    file,
    loading,
    pageLoading,
    copySuccess,
    linkSharing,
    sharedUsers,

    // Functions
    handleUpdatePermission,
    handleRevokeAccess,
    handleCopyLink,
    handleToggleLink,
    handleGoBack,
  } = usePermissionManager();

  // Loading state
  if (pageLoading) {
    return <PermissionManagerShimmer />;
  }

  // File not found state
  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            File not found
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            The file you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <Header
            file={file}
            sharedUsers={sharedUsers}
            onGoBack={handleGoBack}
          />

          {/* File Info */}
          <FileInfo file={file} />

          {/* Link Sharing Card */}
          <LinkSharingCard
            copySuccess={copySuccess}
            file={file}
            handleCopyLink={handleCopyLink}
            linkSharing={linkSharing}
            handleToggleLink={handleToggleLink}
          />

          {/* Shared Users */}
          <SharedUsers
            handleRevokeAccess={handleRevokeAccess}
            handleUpdatePermission={handleUpdatePermission}
            sharedUsers={sharedUsers}
            loading={loading}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <span className="text-gray-700 text-sm">
              Updating permissions...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
