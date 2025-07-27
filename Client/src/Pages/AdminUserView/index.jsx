import {
  ChevronRight,
  Eye,
  File,
  Folder,
  Home
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDirectory } from "../../Apis/adminApi";
import FilePreviewModal from "../../components/Modals/FilePreviewModal";
import { useModal } from "../../Contexts/ModalContext";
import Header from "../AdminViewPage/Sections/Header";

export const AdminUserView = () => {
  const { userId, dirId } = useParams();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState([]);
  const [targetUser, setTargetUser] = useState({});

  const fetchDirectory = async (targetDirId = dirId || "") => {
    setLoading(true);
    try {
      const res = await getUserDirectory(userId, targetDirId);
      if (res.success) {
        setDirectories(res.data.directories || []);
        setFiles(res.data.files || []);
        setTargetUser(res.data.targetUser || {});
      } else {
        showModal(
          "Error",
          res.message || "Failed to fetch user directory",
          "error"
        );
        navigate("/users");
      }
    } catch (error) {
      showModal("Error", "An error occurred while fetching directory", "error");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectoryClick = (directory) => {
    setCurrentPath((prev) => [
      ...prev,
      { id: directory._id, name: directory.name },
    ]);
    navigate(`/users/${userId}/${directory._id}`);
    fetchDirectory(directory._id);
  };

  const handleBreadcrumbClick = async (index) => {
    if (index === -1) {
      setCurrentPath([]);
      navigate(`/users/${userId}`);
      fetchDirectory("");
    } else {
      const targetPath = currentPath[index];
      setCurrentPath((prev) => prev.slice(0, index + 1));
      await fetchDirectory(targetPath.id);
      navigate(`/users/${userId}/${targetPath.id}`);
    }
  };

  const [previewFile, setPreviewFile] = useState(null);

  const ItemCard = ({ item, type, onClick }) => {
    const handleClick = () => {
      if (onClick) onClick(item);
    };

    const handlePreview = (e) => {
      e.stopPropagation();
      setPreviewFile(item);
    };

    return (
      <div
        onClick={type === "directory" ? handleClick : handlePreview}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {type === "directory" ? (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <File className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            {type === "directory" && (
              <p className="text-xs text-gray-500 mt-1">
                {item.itemCount !== undefined
                  ? `${item.itemCount} items`
                  : "Directory"}
              </p>
            )}
          </div>
          {type === "file" && (
            <button
              onClick={handlePreview}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all"
              title="Preview"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchDirectory();
  }, [dirId]);

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
          <div className="inline-flex items-center flex-wrap gap-1 text-xs bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
            {/* Root */}
            <button
              onClick={() => handleBreadcrumbClick(-1)}
              disabled={currentPath.length === 0}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors duration-150 border ${
                currentPath.length === 0
                  ? "bg-blue-50 text-blue-600 border-blue-200 cursor-default font-medium"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Root</span>
            </button>

            {/* Dynamic Directories */}
            {currentPath.map((path, index) => {
              const isActive = index === currentPath.length - 1;
              return (
                <div key={path.id} className="flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    disabled={isActive}
                    className={`px-2.5 py-1 rounded-full transition-colors duration-150 border ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-blue-200 cursor-default font-medium"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {path.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Directories Section */}
          {directories.length > 0 && (
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
                  />
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          {files.length > 0 && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4 text-gray-900 flex items-center">
                <File className="w-5 h-5 mr-2 text-gray-600" />
                Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <ItemCard key={file._id} item={file} type="file" />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {directories.length === 0 && files.length === 0 && (
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
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};
