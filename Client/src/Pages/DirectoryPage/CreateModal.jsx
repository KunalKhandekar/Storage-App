import { useEffect, useRef, useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import { createDirectory } from "../../Apis/file_Dir_Api";

export default function CreateFolderModal({ onClose, onCreate, dirId = "" }) {
  const [directoryName, setDirectoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isSubmitting) handleCreate();
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [directoryName, isSubmitting]);

  const handleCreate = async () => {
    if (!directoryName.trim() || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const res = await createDirectory(dirId, directoryName.trim());
      if (res.success) {
        onCreate();
        onClose();
      } else {
        setError(res.message);
      }
    } catch (error) {
      setError("Failed to create directory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = directoryName.trim().length > 0;
  const hasInvalidChars = /[/\\<>:"|?*]/.test(directoryName);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Create New Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={directoryName}
              onChange={(e) => {
                setDirectoryName(e.target.value);
                setError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter folder name"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Messages */}
          {hasInvalidChars && directoryName && (
            <p className="text-sm text-red-600">
              Invalid characters: / \ : * ? " &lt; &gt; |
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid || hasInvalidChars || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Folder</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
