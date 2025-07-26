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
import { FileIcon, formatTime, PermissionBadge, UserAvatar } from "../../Utils/helpers";


export default function PermissionManager() {
  const navigate = useNavigate();
  const { fileId } = useParams();
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
      const response = await changePermissionOfUserApi(
        fileId,
        userId,
        newPermission
      );
      if (response.success) {
        setSharedUsers((users) =>
          users.map((share) =>
            share.userId._id === userId
              ? { ...share, permission: newPermission }
              : share
          )
        );
      }
    } catch (error) {
      console.error("Failed to update permission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (userId) => {
    setLoading(true);
    try {
      const response = await revokeAccess(fileId, userId);
      if (response.success) {
        setSharedUsers((users) =>
          users.filter((share) => share.userId._id !== userId)
        );
      }
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            File not found
          </h3>
          <p className="text-gray-500 mb-4">
            The file you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="group p-2 sm:p-2.5 hover:bg-white hover:shadow-md rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <ArrowLeft
                  size={18}
                  className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900"
                />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Manage Permissions
                </h1>
                <p
                  className="text-gray-600 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1 truncate"
                  title={file.name}
                >
                  {file.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Settings size={14} className="sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">
                {sharedUsers.length} users
              </span>
            </div>
          </div>

          {/* File Info */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <FileIcon type={file.fileType} size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-gray-900 text-base sm:text-lg truncate"
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="font-medium">{file.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Modified {formatTime(file.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Link Sharing Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Link size={18} className="text-blue-600" />
                </div>
                <span>Link Sharing</span>
              </h3>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Toggle Section */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe size={18} className="text-gray-400 flex-shrink-0" />
                    <p className="font-medium text-gray-900">Share with link</p>
                  </div>
                  <p className="text-sm text-gray-500 ml-6 sm:ml-6">
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
                      className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
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
                    <span className="text-sm text-gray-600">Permission:</span>
                    <PermissionBadge
                      permission={linkSharing.permission || "View Only"}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shared Users */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users size={20} className="text-green-600" />
                </div>
                <span>Shared Users</span>
                <span className="text-sm font-normal text-gray-500">
                  ({sharedUsers.length})
                </span>
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {sharedUsers.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No users shared
                  </h4>
                  <p className="text-gray-500 text-sm">
                    This file hasn't been shared with any specific users yet.
                  </p>
                </div>
              ) : (
                sharedUsers.map((share) => (
                  <div key={share.userId._id} className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-4">
                      <div className="flex items-start gap-3">
                        <UserAvatar user={share.userId} size="w-12 h-12" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {share.userId.name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {share.userId.email}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Shared {formatTime(share.sharedAt)}
                          </p>
                        </div>
                      </div>
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
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <UserAvatar user={share.userId} size="w-12 h-12" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {share.userId.name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {share.userId.email}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Shared {formatTime(share.sharedAt)}
                          </p>
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
                          className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[120px]"
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
                          <Trash2 size={18} />
                        </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <span className="text-gray-700">Updating permissions...</span>
          </div>
        </div>
      )}
    </div>
  );
}
