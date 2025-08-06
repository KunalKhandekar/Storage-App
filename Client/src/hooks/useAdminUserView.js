import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDirectory } from "../Apis/adminApi";
import { useModal } from "../Contexts/ModalContext";

const useAdminUserView = () => {
  const navigate = useNavigate();
  const { userId, dirId } = useParams();
  const { showModal } = useModal();
  
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState([]);
  const [targetUser, setTargetUser] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState(null);

  const fetchDirectory = async (targetDirId = dirId || "") => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await getUserDirectory(userId, targetDirId);
      if (res.success) {
        setDirectories(res.data.directories || []);
        setFiles(res.data.files || []);
        setTargetUser(res.data.targetUser || {});
      } else {
        const errorMessage = res.message || "Failed to fetch user directory";
        setError(errorMessage);
        showModal("Error", errorMessage, "error");
        navigate("/users");
      }
    } catch (error) {
      const errorMessage = "An error occurred while fetching directory";
      setError(errorMessage);
      showModal("Error", errorMessage, "error");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectoryClick = async (directory) => {
    setCurrentPath((prev) => [
      ...prev,
      { id: directory._id, name: directory.name },
    ]);
    navigate(`/users/${userId}/${directory._id}`);
    await fetchDirectory(directory._id);
  };

  const handleBreadcrumbClick = async (index) => {
    if (index === -1) {
      // Navigate to root
      setCurrentPath([]);
      navigate(`/users/${userId}`);
      await fetchDirectory("");
    } else {
      // Navigate to specific breadcrumb level
      const targetPath = currentPath[index];
      setCurrentPath((prev) => prev.slice(0, index + 1));
      navigate(`/users/${userId}/${targetPath.id}`);
      await fetchDirectory(targetPath.id);
    }
  };

  const closeFilePreview = () => {
    setPreviewFile(null);
  };

  const goBack = () => {
    navigate("/users");
  };

  const refreshDirectory = () => {
    fetchDirectory(dirId);
  };

 
  useEffect(() => {
    fetchDirectory();
  }, [dirId, userId]);

  // Computed values
  const hasDirectories = directories.length > 0;
  const hasFiles = files.length > 0;
  const isEmpty = !hasDirectories && !hasFiles;

  return {
    // State
    directories,
    files,
    loading,
    error,
    currentPath,
    targetUser,
    previewFile,
    
    // Computed values
    hasDirectories,
    hasFiles,
    isEmpty,
    
    // Handlers
    handleDirectoryClick,
    handleBreadcrumbClick,
    closeFilePreview,
    goBack,
    refreshDirectory,
    
    // Route params
    userId,
    dirId,
    
    // Direct state setters
    setPreviewFile,
    setCurrentPath,
  };
};

export default useAdminUserView;