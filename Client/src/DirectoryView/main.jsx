import {
  Folder,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import ItemCard from "./ItemCard";
import UploadSection from "./UploadSection";

const FileUploadApp = () => {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [directoryName, setDirectoryName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [actionDone, setActionDone] = useState(false);
  const { dirId } = useParams();
  const navigate = useNavigate();
  const URL = "http://localhost:4000";

  const getItemList = async () => {
    const res = await fetch(`${URL}/directory/${dirId || ""}`, {
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        navigate("/login");
      } else {
        console.error(`Fetch failed with status: ${res.status}`);
      }
      return;
    }

    try {
      const dirItems = await res.json();

      setFiles(dirItems?.files);
      setDirectories(dirItems?.directory);
      setCurrentPath(dirItems?.name);
    } catch (err) {
      console.error("Error fetching files:", err.message);
    }
  };

  useEffect(() => {
    getItemList();
    setActionDone(false);
  }, [actionDone, dirId]);

  const handleCreateDirectory = async () => {
    if (!directoryName.trim()) return;
    await fetch(URL + `/directory/${dirId || ""}`, {
      headers: {
        dirname: directoryName.trim(),
      },
      method: "POST",
      credentials: "include",
    });
    setDirectoryName("");
    setShowCreateModal(false);
    setActionDone(true);
  };

  const allItems = [...directories, ...files].sort((a, b) => {
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        setShowUserDropdown={setShowUserDropdown}
        showUserDropdown={showUserDropdown}
      />

      {/* Main Content */}
      <main className="p-6">
        {/* Upload Progress */}
        <UploadSection
          setShowCreateModal={setShowCreateModal}
          setActionDone={setActionDone}
        />

        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 pl-3.5 pb-3.5">
            Current Directory : {currentPath}
          </h1>
        </div>

        {/* Directory Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              setCurrentPath={setCurrentPath}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              setActionDone={setActionDone}
            />
          ))}
        </div>

        {allItems.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files or folders
            </h3>
            <p className="text-gray-500">
              Upload some files or create a directory to get started
            </p>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Directory
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDirectoryName("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Directory Name
              </label>
              <input
                type="text"
                value={directoryName}
                onChange={(e) => setDirectoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter directory name...`}
                onKeyPress={(e) => e.key === "Enter" && handleCreateDirectory()}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateDirectory}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setDirectoryName("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showUserDropdown || activeDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowUserDropdown(false);
            setActiveDropdown(null);
          }}
        />
      )}
    </div>
  );
};

export default FileUploadApp;
