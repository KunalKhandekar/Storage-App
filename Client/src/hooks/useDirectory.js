import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemList } from "../Apis/file_Dir_Api";
import { useAuth } from "../Contexts/AuthContext";
import { toast } from "sonner";

const useDirectory = () => {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [actionDone, setActionDone] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { dirId } = useParams();

  const fetchDirectoryItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getItemList(dirId);
      if (res.success) {
        const { files, directory, name, breadCrumb } = res.data;
        setBreadCrumb(breadCrumb);
        setFiles(files);
        setDirectories(directory);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while fetching directory items"
      );
      console.error("Error fetching directory items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectoryItems();
    setActionDone(false);
  }, [actionDone, dirId]);

  // Sort items: directories first, then files, alphabetically within each type
  const allItems = [...directories, ...files].sort((a, b) => {
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  // Modal handlers
  const handleCreateModalOpen = () => setShowCreateModal(true);
  const handleCreateModalClose = () => setShowCreateModal(false);
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setActionDone(true);
  };

  const handleShareModalOpen = (file) => {
    setCurrentFile(file);
    setShowShareModal(true);
  };
  const handleShareModalClose = () => {
    setShowShareModal(false);
    setCurrentFile(null);
  };

  // Dropdown handlers
  const handleDropdownClose = () => setActiveDropdown(null);
  const handleDropdownToggle = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  // Action handlers
  const handleActionComplete = () => setActionDone(true);
  const refreshDirectory = () => setActionDone(true);

  return {
    // State
    files,
    directories,
    allItems,
    loading,
    error,
    breadCrumb,

    // Modal state
    showCreateModal,
    showShareModal,
    currentFile,

    // Dropdown state
    activeDropdown,

    // Modal handlers
    handleCreateModalOpen,
    handleCreateModalClose,
    handleCreateSuccess,
    handleShareModalOpen,
    handleShareModalClose,

    // Dropdown handlers
    handleDropdownClose,
    handleDropdownToggle,

    // Action handlers
    handleActionComplete,
    refreshDirectory,

    // state setters
    setActiveDropdown,
    setActionDone,
    setShowShareModal,
    setCurrentFile,
    setShowCreateModal,

    // Route params
    dirId,
  };
};

export default useDirectory;
