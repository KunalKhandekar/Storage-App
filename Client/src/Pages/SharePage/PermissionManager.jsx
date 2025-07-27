import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Edit3,
  Eye,
  Globe,
  Link,
  Loader2,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  changePermissionOfUserApi,
  generateShareLinkApi,
  getFilePermisssionInfo,
  revokeAccess,
  toggleLink,
} from "../../Apis/shareApi";
import {
  FileIcon,
  formatTime,
  PermissionBadge,
  UserAvatar,
} from "../../Utils/helpers";
import { useModal } from "../../Contexts/ModalContext";

export default function PermissionManager() {
  const navigate = useNavigate();
  const { fileId } = useParams();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkSharing, setLinkSharing] = useState({
    link: ``,
    enabled: false,
    permission: "viewer",
  });
  const [sharedUsers, setSharedUsers] = useState([]);

  const fetchFilePermissionInfo = async () => {
    setPageLoading(true);
    try {
      const response = await getFilePermisssionInfo(fileId);
      if (response.success) {
        const fileInfo = response.data.fileInfo;
        setFile(fileInfo);
        if (fileInfo?.sharedViaLink?.enabled) {
          setLinkSharing({
            link: `http://localhost:5173/guest/access/${fileInfo._id}?token=${fileInfo.sharedViaLink.token}`,
            enabled: fileInfo.sharedViaLink.enabled,
            permission: fileInfo.sharedViaLink.permission,
          });
        }
        setSharedUsers(fileInfo?.sharedWith || []);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch file info:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchFilePermissionInfo();
  }, [fileId]);

  const handleUpdatePermission = async (userId, newPermission) => {
    setLoading(true);
    try {
      const selectedUser = sharedUsers.find((u) => u.userId._id === userId)?.userId;

      showConfirmModal(
        "Change User Permission",
        `Are you sure you want to change ${selectedUser?.name}'s permission to "${newPermission}"? This will immediately update their access level.`,
        async () => {
          const res = await changePermissionOfUserApi(
            fileId,
            userId,
            newPermission
          );
          if (res.success) {
            setSharedUsers((users) =>
              users.map((share) =>
                share.userId._id === userId
                  ? { ...share, permission: newPermission }
                  : share
              )
            );
          } else {
            showModal("Error", res.message || "Something went wrong.", "error");
          }
          closeConfirmModal();
        },
        "warning"
      );
    } catch (error) {
      console.error("Failed to update permission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (userId) => {
    setLoading(true);
    try {
      const selectedUser = sharedUsers.find((u) => u.userId._id === userId)?.userId;
      showConfirmModal(
        "Revoke Access",
        `Are you sure you want to revoke ${selectedUser?.name}'s access? They will no longer be able to view or interact with this file.`,
        async () => {
          const res = await revokeAccess(fileId, userId);
          if (res.success) {
            setSharedUsers((users) =>
              users.filter((share) => share.userId._id !== userId)
            );
          } else {
            showModal("Error", res.message || "Something went wrong.", "error");
          }
          closeConfirmModal();
        },
        "warning"
      );
    } catch (error) {
      console.error("Failed to revoke access:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (linkSharing.link) {
      try {
        await navigator.clipboard.writeText(linkSharing.link);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
      }
    }
  };

  const handleToggleLink = async () => {
    const newState = !linkSharing.enabled;
    try {
      let res;
      if (linkSharing.permission) {
        res = await toggleLink(file._id, newState);
        if (res.success) {
          setLinkSharing((prev) => ({
            ...prev,
            enabled: newState,
          }));
        }
      } else {
        res = await generateShareLinkApi(file._id, "viewer");
        if (res.success) {
          setLinkSharing({
            link: res.data.link,
            permission: res.data.permission,
            enabled: res.data.enabled,
          });
        }
      }
    } catch (error) {
      console.error("Failed to toggle link:", error);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate(-1)}
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
          {/* Enhanced Header */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="group p-2 sm:p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <ArrowLeft
                    size={16}
                    className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900"
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings size={18} className="text-blue-600" />
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                      Manage Permissions
                    </h1>
                  </div>
                  <p
                    className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate ml-11"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                  <Users size={14} />
                  <span>{sharedUsers.length} users</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* File Info */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <FileIcon type={file.fileType} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-medium text-gray-900 text-sm lg:text-base truncate"
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="font-medium">{file.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Modified {formatTime(file.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Link Sharing Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Link size={18} className="text-blue-600" />
                </div>
                <h3 className="text-sm lg:text-base font-medium text-gray-900">
                  Link Sharing
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Toggle Section */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe size={18} className="text-gray-400 flex-shrink-0" />
                    <p className="font-medium text-gray-900 text-sm">
                      Share with link
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 ml-6 sm:ml-6">
                    {linkSharing.enabled
                      ? "Anyone with the link can access this file"
                      : "Link sharing is currently disabled"}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleToggleLink}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      linkSharing.enabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    aria-label={`${
                      linkSharing.enabled ? "Disable" : "Enable"
                    } link sharing`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        linkSharing.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Link Section - Only show when enabled */}
              {linkSharing.enabled && (
                <div className="mt-6 space-y-4">
                  {/* Link Input and Copy Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={
                        linkSharing.link ||
                        `http://localhost:5173/guest/access/${file?._id}?token=${file?.sharedViaLink?.token}`
                      }
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                        copySuccess
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 active:bg-blue-200"
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <Check size={16} />
                          <span className="hidden sm:inline">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="hidden sm:inline">Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Permission Badge */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-gray-600">Permission:</span>
                    <PermissionBadge
                      permission={linkSharing.permission || "View Only"}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shared Users */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users size={18} className="text-green-600" />
                </div>
                <h3 className="text-sm lg:text-base font-medium text-gray-900">
                  Shared Users
                </h3>
                <span className="text-xs font-normal text-gray-500">
                  ({sharedUsers.length})
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {sharedUsers.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Users size={28} className="sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
                    No users shared
                  </h4>
                  <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                    This file hasn't been shared with any specific users yet.
                  </p>
                </div>
              ) : (
                sharedUsers.map((share) => (
                  <div
                    key={share.userId._id}
                    className="group bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                            <UserAvatar user={share.userId} size="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight"
                              title={share.userId.name}
                            >
                              {share.userId.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                              <span>{share.userId.email}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                Shared {formatTime(share.sharedAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <PermissionBadge permission={share.permission} />
                              <div className="flex items-center gap-2">
                                <select
                                  value={share.permission}
                                  onChange={(e) =>
                                    handleUpdatePermission(
                                      share.userId._id,
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                  <option value="viewer">View Only</option>
                                  <option value="editor">Can Edit</option>
                                </select>
                                <button
                                  onClick={() =>
                                    handleRevokeAccess(share.userId._id)
                                  }
                                  disabled={loading}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Revoke access"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-200">
                            <UserAvatar user={share.userId} size="w-8 h-8" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4
                                className="text-sm lg:text-base font-medium text-gray-900 truncate"
                                title={share.userId.name}
                              >
                                {share.userId.name}
                              </h4>
                              <PermissionBadge permission={share.permission} />
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{share.userId.email}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                Shared {formatTime(share.sharedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={share.permission}
                            onChange={(e) =>
                              handleUpdatePermission(
                                share.userId._id,
                                e.target.value
                              )
                            }
                            disabled={loading}
                            className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[120px]"
                          >
                            <option value="viewer">View Only</option>
                            <option value="editor">Can Edit</option>
                          </select>
                          <button
                            onClick={() => handleRevokeAccess(share.userId._id)}
                            disabled={loading}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Revoke access"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
