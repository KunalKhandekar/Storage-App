import { File, Folder, X } from "lucide-react";
import { formatDate, formatFileSize } from "../../Utils/helpers";

const FileDetailsModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;
  console.log(item);

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded">
              {item.type === "directory" ? (
                <Folder className="w-6 h-6 text-blue-500" />
              ) : (
                <File className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{item.type}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Size</span>
              <span className="text-sm font-medium">
                {formatFileSize(item.size)}
              </span>
            </div>

            {item.type === "directory" && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Files</span>
                  <span className="text-sm font-medium">{item.files || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Subdirectories</span>
                  <span className="text-sm font-medium">
                    {item.directories || 0}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Created</span>
              <span className="text-sm font-medium">
                {formatDate(item.createdAt)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Modified</span>
              <span className="text-sm font-medium">
                {formatDate(item.updatedAt)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Path</span>
              <span className="text-sm font-medium text-right break-all">
                {item.path}
              </span>
            </div>

            {item.sharedViaLink && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Shared via link</span>
                <span className="text-sm font-medium">
                  {item.sharedViaLink.enabled ? "Yes" : "No"}
                </span>
              </div>
            )}

            {item.sharedWith && item.sharedWith.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">
                  Shared through email
                </span>
                <span className="text-sm font-medium">
                  {item.sharedWith.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;
