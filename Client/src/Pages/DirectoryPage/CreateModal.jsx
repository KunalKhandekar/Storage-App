import { useEffect, useRef, useState } from "react";
import {
  X,
  FolderPlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { createDirectory } from "../../Apis/file_Dir_Api";
import { toast } from "sonner";

export default function CreateFolderModal({ onClose, onCreate, dirId = "" }) {
  const [directoryName, setDirectoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [touchedInput, setTouchedInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure smooth focus
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isSubmitting && isValid && !hasInvalidChars) {
        e.preventDefault();
        handleCreate();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [directoryName, isSubmitting]);

  const handleCreate = async () => {
    if (!directoryName.trim() || isSubmitting || hasInvalidChars) return;

    setError("");
    setIsSubmitting(true);

    try {
      const res = await createDirectory(dirId, directoryName.trim());
      if (res.success) {
        onCreate();
        toast.success(`${directoryName} folder created.`);
        onClose();
      } else {
        setError(res.message || "Failed to create folder");
      }
    } catch (err) {
      setError("Failed to create folder. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trimmedName = directoryName.trim();
  const isValid = trimmedName.length > 0;
  const isTooLong = trimmedName.length > 255;
  const hasInvalidChars = /[/\\<>:"|?*]/.test(directoryName);
  const hasLeadingTrailingSpaces =
    directoryName !== trimmedName && directoryName.length > 0;

  const showError = touchedInput && (hasInvalidChars || isTooLong);
  const showSuccess = touchedInput && isValid && !hasInvalidChars && !isTooLong;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FolderPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Folder
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Add a new folder to organize your files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={directoryName}
                onChange={(e) => {
                  setDirectoryName(e.target.value);
                  setError("");
                  setTouchedInput(true);
                }}
                onBlur={() => setTouchedInput(true)}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  showError
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : showSuccess
                    ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                placeholder="e.g., Documents, Projects, Photos"
                disabled={isSubmitting}
                maxLength={255}
              />
              {/* Status Icon */}
              {touchedInput && directoryName && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showError ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : showSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : null}
                </div>
              )}
            </div>

            {/* Character count */}
            <div className="flex justify-between items-center mt-1.5">
              <div className="text-xs text-gray-500">
                {trimmedName.length > 0 && (
                  <span className={isTooLong ? "text-red-600 font-medium" : ""}>
                    {trimmedName.length}/255 characters
                  </span>
                )}
              </div>
              {hasLeadingTrailingSpaces && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Spaces will be trimmed
                </span>
              )}
            </div>
          </div>

          {/* Validation Messages */}
          <div className="space-y-2">
            {hasInvalidChars && touchedInput && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Invalid characters detected</p>
                  <p className="text-xs mt-1 text-red-700">
                    Cannot contain:{" "}
                    <code className="bg-red-100 px-1 rounded">
                      / \ : * ? " &lt; &gt; |
                    </code>
                  </p>
                </div>
              </div>
            )}

            {isTooLong && touchedInput && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Folder name is too long</p>
                  <p className="text-xs mt-1 text-red-700">
                    Maximum length is 255 characters
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid || hasInvalidChars || isTooLong || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm hover:shadow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                <span>Create Folder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
