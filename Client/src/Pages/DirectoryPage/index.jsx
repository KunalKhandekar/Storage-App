import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemList } from "../../Apis/file_Dir_Api";
import CreateModal from "./CreateModal";
import Header from "./Header";
import ItemCard from "./ItemCard";
import UploadSection from "./UploadSection";

const FileUploadApp = () => {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [directoryName, setDirectoryName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [actionDone, setActionDone] = useState(false);
  const { dirId } = useParams();
  const navigate = useNavigate();

  const fetchDirectoryItems = async () => {
    const res = await getItemList(dirId);
    if (res.success) {
      const { files, directory, name } = res.data;
      setFiles(files);
      setDirectories(directory);
      setCurrentPath(name);
      // TOAST
    } else {
      // TOAST
      console.log(res.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDirectoryItems();
    setActionDone(false);
  }, [actionDone, dirId]);

  const allItems = [...directories, ...files].sort((a, b) => {
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-fit max-w-6xl m-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
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
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          setDirectoryName={setDirectoryName}
          directoryName={directoryName.trim()}
          onCreate={() => {
            setShowCreateModal(false);
            setActionDone(true);
          }}
        />
      )}

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setActiveDropdown(null);
          }}
        />
      )}
    </div>
  );
};

export default FileUploadApp;
