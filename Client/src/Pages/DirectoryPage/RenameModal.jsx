import { useEffect, useRef, useState } from "react";
import { X, AlertTriangle, Check, Loader2, File, Folder } from "lucide-react";
import { renameFile_or_Directory } from "../../Apis/file_Dir_Api";

export default function RenameModal({ item, onClose, onRename, ApiFunc = renameFile_or_Directory  }) {
  const [newName, setNewName] = useState(item.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const focusTimeout = setTimeout(() => {
      input.focus();
      const dotIndex = item.name.lastIndexOf(".");
      if (dotIndex !== -1 && item.type === "file") {
        input.setSelectionRange(0, dotIndex);
      } else {
        input.select();
      }
    }, 150);

    return () => clearTimeout(focusTimeout);
  }, [item.name, item.type]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isSubmitting) {
        e.preventDefault();
        handleRename();
      } else if (e.key === "Escape") {
        onClose();
      }
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
        console.log(res.message);
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

  const isValidName = newName.trim() && newName !== item.name;
  const isEmpty = !newName.trim();
  const isSameName = newName === item.name;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              {item.type === "file" ? (
                <File className="w-5 h-5 text-blue-600" />
              ) : (
                <Folder className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Rename {item.type}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Enter a new name for "{item.name}"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <label
                htmlFor="rename-input"
                className="block text-sm font-semibold text-gray-700"
              >
                New name
              </label>
              <div className="relative group">
                <input
                  id="rename-input"
                  type="text"
                  ref={inputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border-2 rounded-2xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 font-medium ${
                    isEmpty
                      ? "border-red-200 bg-red-50/50 focus:border-red-400 focus:bg-red-50"
                      : isSameName
                      ? "border-amber-200 bg-amber-50/50 focus:border-amber-400 focus:bg-amber-50"
                      : isValidName
                      ? "border-green-200 bg-green-50/50 focus:border-green-400 focus:bg-green-50"
                      : "border-gray-200 bg-gray-50/50 focus:border-blue-400 focus:bg-blue-50/50"
                  } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                  placeholder={`Enter new ${item.type} name`}
                  disabled={isSubmitting}
                />

                {/* Status Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : isEmpty ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : isSameName ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : isValidName ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : null}
                </div>
              </div>

              {/* Validation Messages */}
              {isEmpty && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100 animate-in slide-in-from-top-1 duration-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">Name cannot be empty</p>
                </div>
              )}

              {isSameName && !isEmpty && (
                <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 animate-in slide-in-from-top-1 duration-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Name is the same as current
                  </p>
                </div>
              )}

              {isValidName && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-100 animate-in slide-in-from-top-1 duration-200">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">Ready to rename</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-b-3xl border-t border-gray-100">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              disabled={!isValidName || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Renaming...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Rename</span>
                </>
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/60 border border-gray-200 rounded-lg font-mono font-semibold shadow-sm">
                Enter
              </kbd>
              <span>to rename</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/60 border border-gray-200 rounded-lg font-mono font-semibold shadow-sm">
                Esc
              </kbd>
              <span>to cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
