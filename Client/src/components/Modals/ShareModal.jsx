"use client";

import {
  Check,
  ChevronDown,
  Copy,
  Edit3,
  Eye,
  Globe,
  Link,
  Loader2,
  Mail,
  Users,
  X,
  UserCheck,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  changePermissionApi,
  generateShareLinkApi,
  getSharedUserAccessList,
  shareWithEmail,
  toggleLink,
} from "../../Apis/shareApi";
import { UserAvatar } from "../../Utils/helpers";

// Mock API functions - replace with your actual API calls
const mockApis = {
  generateShareLinkApi: async (fileId, permission) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        link: `https://example.com/share/${fileId}?permission=${permission}`,
        permission,
      },
    };
  },

  getSharedUserAccessList: async (fileId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        availableUser: [
          { id: 1, name: "John Doe", email: "john@example.com", avatar: "JD" },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "JS",
          },
          { id: 3, name: "Bob Wilson", email: "bob@example.com", avatar: "BW" },
        ],
        sharedUser: [
          {
            id: 4,
            name: "Alice Johnson",
            email: "alice@example.com",
            avatar: "AJ",
            permission: "editor",
            sharedAt: "2024-01-15",
          },
          {
            id: 5,
            name: "Mike Brown",
            email: "mike@example.com",
            avatar: "MB",
            permission: "viewer",
            sharedAt: "2024-01-10",
          },
        ],
      },
    };
  },

  toggleLink: async (fileId, enabled) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: { permission: enabled ? "viewer" : null },
    };
  },

  changePermissionApi: async (fileId, permission) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: { permission },
    };
  },
};

const ShareModal = ({ isCompleted, error, closeModal, currentFile }) => {
  // Tab and UI state
  const [activeTab, setActiveTab] = useState("link");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Link sharing state
  const [isLinkEnabled, setIsLinkEnabled] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkPermission, setLinkPermission] = useState("viewer");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // User management state
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Initialize data when modal opens
  useEffect(() => {
    initializeModalData();
  }, [currentFile._id]);

  const initializeModalData = async () => {
    setIsLoadingUsers(true);
    try {
      // Load shared users data
      await loadSharedUsers();
      // Generate initial share link
      await generateShareLink("viewer");
    } catch (error) {
      console.error("Failed to initialize modal data:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadSharedUsers = async () => {
    try {
      const response = await getSharedUserAccessList(currentFile._id);
      if (response.success) {
        setAvailableUsers(response.data.availableUsers);
        setSharedUsers(response.data.sharedUsers);
      }
    } catch (error) {
      console.error("Failed to load shared users:", error);
    }
  };

  const generateShareLink = async (permission) => {
    setIsGeneratingLink(true);
    try {
      const response = await generateShareLinkApi(currentFile._id, permission);
      if (response.success) {
        setShareLink(response.data.link);
        setLinkPermission(response.data.permission);
        setIsLinkEnabled(response.data.enabled);
      }
    } catch (error) {
      console.error("Failed to generate share link:", error);
      setShareLink("");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleToggleLink = async () => {
    const newState = !isLinkEnabled;
    setIsLinkEnabled(newState);

    try {
      const response = await toggleLink(currentFile._id, newState);
      if (response.success) {
        setLinkPermission(response.data.permission);
      }
    } catch (error) {
      console.error("Failed to toggle link:", error);
      setIsLinkEnabled(!newState); // Revert on error
    }
  };

  const handleChangeLinkPermission = async (newPermission) => {
    if (linkPermission === newPermission) return;

    try {
      const response = await changePermissionApi(
        currentFile._id,
        newPermission
      );
      if (response.success) {
        setLinkPermission(response.data.permission);
      }
    } catch (error) {
      console.error("Failed to change permission:", error);
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, { ...user, permission: "viewer" }]);
    }
    setShowUserDropdown(false);
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const updateUserPermission = (userId, newPermission) => {
    setSelectedUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, permission: newPermission } : user
      )
    );
  };

  const handleSendInvites = async () => {
    console.log(selectedUsers);
    const res = await shareWithEmail(currentFile._id, selectedUsers);
    if (res.success) {
      if (res.data.response.length === 0) {
        setSelectedUsers([]);
        loadSharedUsers();
      } else {
        console.log(res.data.response);
      }
    }
  };

  const getFilteredAvailableUsers = () => {
    return availableUsers.filter(
      (user) =>
        !selectedUsers.find((selected) => selected._id === user._id) &&
        !sharedUsers.find((shared) => shared._id === user._id)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const PermissionBadge = ({ permission }) => (
    <div
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        permission === "editor"
          ? "bg-orange-100 text-orange-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {permission === "editor" ? <Edit3 size={10} /> : <Eye size={10} />}
      <span className="capitalize">{permission}</span>
    </div>
  );


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Share Document
              </h2>
              <p className="text-sm text-gray-500 hidden sm:block">
                Collaborate with others
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-50">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "link"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Link size={16} />
              <span className="hidden sm:inline">Share Link</span>
              <span className="sm:hidden">Link</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "email"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Mail size={16} />
              <span className="hidden sm:inline">Email Invite</span>
              <span className="sm:hidden">Email</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "shared"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <UserCheck size={16} />
              <span className="hidden sm:inline">Shared With</span>
              <span className="sm:hidden">Shared</span>
              {sharedUsers.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                  {sharedUsers.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              {/* Link Tab */}
              {activeTab === "link" && (
                <div className="space-y-6">
                  {/* Link Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe size={20} className="text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Share with link
                        </div>
                        <div className="text-xs text-gray-500">
                          Anyone with the link can access
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleLink}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isLinkEnabled ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isLinkEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {isLinkEnabled && (
                    <>
                      {/* Permission Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Permission level
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleChangeLinkPermission("viewer")}
                            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border transition-all duration-200 ${
                              linkPermission === "viewer"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">Viewer</span>
                          </button>
                          <button
                            onClick={() => handleChangeLinkPermission("editor")}
                            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border transition-all duration-200 ${
                              linkPermission === "editor"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <Edit3 size={16} />
                            <span className="text-sm font-medium">Editor</span>
                          </button>
                        </div>
                      </div>

                      {/* Copy Link */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Share link
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
                          />
                          <button
                            onClick={handleCopyLink}
                            disabled={isGeneratingLink}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                              copied
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            }`}
                          >
                            {isGeneratingLink ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : copied ? (
                              <div className="flex items-center space-x-1">
                                <Check size={16} />
                                <span>Copied!</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <Copy size={16} />
                                <span>Copy</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Email Tab */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select users to invite
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                      >
                        <span className="text-gray-500">
                          {getFilteredAvailableUsers().length > 0
                            ? "Choose users to invite"
                            : "No more users to invite"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform ${
                            showUserDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showUserDropdown &&
                        getFilteredAvailableUsers().length > 0 && (
                          <div className="relative top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                            {getFilteredAvailableUsers().map((user) => (
                              <button
                                key={user._id}
                                onClick={() => handleSelectUser(user)}
                                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                              >
                                <UserAvatar user={user} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {user.email}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Selected Users */}
                  {selectedUsers.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Selected users ({selectedUsers.length})
                      </label>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedUsers.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <UserAvatar user={user} />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-3">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() =>
                                    updateUserPermission(user._id, "viewer")
                                  }
                                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                    user.permission === "viewer"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  Viewer
                                </button>
                                <button
                                  onClick={() =>
                                    updateUserPermission(user._id, "editor")
                                  }
                                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                    user.permission === "editor"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  Editor
                                </button>
                              </div>
                              <button
                                onClick={() => removeSelectedUser(user._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Send Invites Button */}
                  <button
                    onClick={handleSendInvites}
                    disabled={selectedUsers.length === 0}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedUsers.length > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {selectedUsers.length > 0
                      ? `Send ${selectedUsers.length} Invite${
                          selectedUsers.length > 1 ? "s" : ""
                        }`
                      : "Select users to send invites"}
                  </button>
                </div>
              )}

              {/* Shared With Tab */}
              {activeTab === "shared" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Shield size={20} className="text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Users with Access
                    </h3>
                  </div>

                  {sharedUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No users shared yet
                      </h3>
                      <p className="text-gray-500">
                        Use the Email Invite tab to share this document with
                        others.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sharedUsers.map(({ userId, permission, sharedAt }) => (
                        <div
                          key={userId._id}
                          className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <UserAvatar user={userId} size="w-10 h-10" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {userId.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {userId.email}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Shared on {formatDate(sharedAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <PermissionBadge permission={permission} />
                            <div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              title="Active"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
