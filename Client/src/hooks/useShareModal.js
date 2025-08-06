import { useEffect, useState } from "react";
import {
  changePermissionApi,
  generateShareLinkApi,
  getSharedUserAccessList,
  shareWithEmail,
  toggleLink,
} from "../Apis/shareApi";

export const useShareModal = (currentFile) => {
  // Tabs & UI
  const [activeTab, setActiveTab] = useState("link");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Link Sharing
  const [isLinkEnabled, setIsLinkEnabled] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkPermission, setLinkPermission] = useState("viewer");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // User management
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    initializeModalData();
  }, [currentFile._id]);

  const initializeModalData = async () => {
    setIsLoadingUsers(true);
    try {
      await loadSharedUsers();
      await generateShareLink("viewer");
    } catch (err) {
      console.error("Init failed:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadSharedUsers = async () => {
    try {
      const res = await getSharedUserAccessList(currentFile._id);
      if (res.success) {
        setAvailableUsers(res.data.availableUsers);
        setSharedUsers(res.data.sharedUsers);
      }
    } catch (err) {
      console.error("Load shared users failed:", err);
    }
  };

  const generateShareLink = async (permission) => {
    setIsGeneratingLink(true);
    try {
      const res = await generateShareLinkApi(currentFile._id, permission);
      if (res.success) {
        setShareLink(res.data.link);
        setLinkPermission(res.data.permission);
        setIsLinkEnabled(res.data.enabled);
      }
    } catch (err) {
      console.error("Generate link failed:", err);
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
    } catch (err) {
      console.error("Copy link failed:", err);
    }
  };

  const handleToggleLink = async () => {
    const newState = !isLinkEnabled;
    setIsLinkEnabled(newState);

    try {
      const res = await toggleLink(currentFile._id, newState);
      if (res.success) {
        setLinkPermission(res.data.permission);
      }
    } catch (err) {
      console.error("Toggle failed:", err);
      setIsLinkEnabled(!newState); // revert
    }
  };

  const handleChangeLinkPermission = async (newPermission) => {
    if (linkPermission === newPermission) return;

    try {
      const res = await changePermissionApi(currentFile._id, newPermission);
      if (res.success) {
        setLinkPermission(res.data.permission);
      }
    } catch (err) {
      console.error("Change permission failed:", err);
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
      prev.map((u) => (u._id === userId ? { ...u, permission: newPermission } : u))
    );
  };

  const handleSendInvites = async () => {
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
      (u) =>
        !selectedUsers.find((s) => s._id === u._id) &&
        !sharedUsers.find((s) => s._id === u._id)
    );
  };

  return {
    activeTab,
    setActiveTab,
    showUserDropdown,
    setShowUserDropdown,
    isLinkEnabled,
    setIsLinkEnabled,
    shareLink,
    linkPermission,
    isGeneratingLink,
    copied,
    availableUsers,
    sharedUsers,
    selectedUsers,
    isLoadingUsers,
    handleCopyLink,
    handleToggleLink,
    handleChangeLinkPermission,
    handleSelectUser,
    removeSelectedUser,
    updateUserPermission,
    handleSendInvites,
    getFilteredAvailableUsers,
  };
};
