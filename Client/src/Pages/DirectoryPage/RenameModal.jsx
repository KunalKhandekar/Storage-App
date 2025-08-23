import { useEffect, useRef, useState } from "react";
import { X, Loader2, File, Folder } from "lucide-react";
import { renameFile_or_Directory } from "../../Apis/file_Dir_Api";

export default function RenameModal({ item, onClose, onRename, ApiFunc = renameFile_or_Directory }) {
  const [newName, setNewName] = useState(item.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    setTimeout(() => {
      input.focus();
      // Select filename without extension for files
      const dotIndex = item.name.lastIndexOf(".");
      if (dotIndex !== -1 && item.type === "file") {
        input.setSelectionRange(0, dotIndex);
      } else {
        input.select();
      }
    }, 100);
  }, []); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isSubmitting) handleRename();
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [newName, isSubmitting]); 

  const handleRename = async () => {
    if (!newName.trim() || newName === item.name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await ApiFunc(item, newName.trim());
      if (res.success) {
        onRename(res);
        onClose();
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error("Error renaming:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileExtension = (filename) => {
    const dotIndex = filename.lastIndexOf(".");
    return dotIndex !== -1 ? filename.substring(dotIndex) : "";
  };

  const originalExtension = item.type === "file" ? getFileExtension(item.name) : "";
  const newExtension = item.type === "file" ? getFileExtension(newName) : "";
  
  const isValid = newName.trim() && newName !== item.name;
  const isEmpty = !newName.trim();
  const isSameName = newName === item.name;
  const extensionChanged = item.type === "file" && originalExtension !== newExtension;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {item.type === "file" ? (
              <File className="w-5 h-5 text-blue-600" />
            ) : (
              <Folder className="w-5 h-5 text-blue-600" />
            )}
            <h2 className="text-lg font-semibold">Rename {item.type}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                isEmpty 
                  ? "border-red-300 focus:ring-red-500" 
                  : extensionChanged
                  ? "border-red-300 focus:ring-red-500"
                  : isSameName 
                  ? "border-yellow-300 focus:ring-yellow-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder={`Enter new ${item.type} name`}
              disabled={isSubmitting}
            />
          </div>

          {/* Validation Messages */}
          {isEmpty && (
            <p className="text-sm text-red-600">Name cannot be empty</p>
          )}
          {extensionChanged && (
            <p className="text-sm text-red-600">
              File extension cannot be changed (must end with {originalExtension})
            </p>
          )}
          {isSameName && !isEmpty && !extensionChanged && (
            <p className="text-sm text-yellow-600">Name is the same as current</p>
          )}
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
            onClick={handleRename}
            disabled={!isValid || isSubmitting || extensionChanged}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Renaming...</span>
              </>
            ) : (
              <span>Rename</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}