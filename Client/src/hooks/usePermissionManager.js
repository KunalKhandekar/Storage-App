import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  changePermissionOfUserApi,
  generateShareLinkApi,
  getFilePermissionInfo,
  revokeAccess,
  toggleLink,
} from "../Apis/shareApi";
import { useModal } from "../Contexts/ModalContext";

export const usePermissionManager = () => {
  const navigate = useNavigate();
  const { fileId } = useParams();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();
  
  // States
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

  // Fetch file permission info
  const fetchFilePermissionInfo = async () => {
    setPageLoading(true);
    try {
      const response = await getFilePermissionInfo(fileId);
      if (response.success) {
        const fileInfo = response.data.fileInfo;
        setFile(fileInfo);
        
        // Set link sharing if enabled
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

  // Update user permission
  const handleUpdatePermission = async (userId, newPermission) => {
    setLoading(true);
    try {
      const selectedUser = sharedUsers.find(
        (u) => u.userId._id === userId
      )?.userId;

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

  // Revoke user access
  const handleRevokeAccess = async (userId) => {
    setLoading(true);
    try {
      const selectedUser = sharedUsers.find(
        (u) => u.userId._id === userId
      )?.userId;
      
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

  // Copy link to clipboard
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

  // Toggle link sharing
  const handleToggleLink = async () => {
    const newState = !linkSharing.enabled;
    try {
      let res;
      if (linkSharing.permission) {
        res = await toggleLink(file._id, newState);
        if (res.success) {
          setLinkSharing((prev) => ({
            ...prev,
            link: `http://localhost:5173/guest/access/${file._id}?token=${file.sharedViaLink.token}`,
            enabled: newState,
          }));
        }
      } else {
        res = await generateShareLinkApi(file._id, "viewer");
        if (res.success) {
          console.log(res.data);
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

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchFilePermissionInfo();
  }, [fileId]);

  return {
    // States
    file,
    loading,
    pageLoading,
    copySuccess,
    linkSharing,
    sharedUsers,
    fileId,
    
    // Functions
    fetchFilePermissionInfo,
    handleUpdatePermission,
    handleRevokeAccess,
    handleCopyLink,
    handleToggleLink,
    handleGoBack,
    
    // State setters
    setFile,
    setLoading,
    setPageLoading,
    setCopySuccess,
    setLinkSharing,
    setSharedUsers,
  };
};