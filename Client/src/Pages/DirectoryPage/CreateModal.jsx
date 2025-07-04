import { X } from "lucide-react";
import { createDirectory } from "../../Apis/file_Dir_Api";
import { useParams } from "react-router-dom";

const CreateModal = ({
  onClose,
  setDirectoryName,
  directoryName,
  onCreate,
}) => {
  const { dirId } = useParams();

  const handleCreateDirectory = async () => {
    if (!directoryName) return;
    const res = await createDirectory(dirId, directoryName);
    if (res.success) {
      // TOAST
      console.log(res.message);
      setDirectoryName("");
      onCreate();
    } else {
      // TOAST
      console.log(res.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
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
              onClose();
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
              onClose();
              setDirectoryName("");
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
