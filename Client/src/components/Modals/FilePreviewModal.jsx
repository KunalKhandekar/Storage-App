import { Download, ExternalLink, X, File, Image, Music } from "lucide-react";
import { renderFilePreview } from "../../Utils/helpers";

const FilePreviewModal = ({ file, onClose }) => {
  const fileUrl = `${import.meta.env.BACKEND_URL}/user/${file.userId}/file/${file._id}`;

  return (
    <div
      className="fixed inset-0 bg-black/30 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 truncate max-w-xs">
            {file.name}
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={`${fileUrl}?action=download`}
              target="_blank"
              className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-72px)]">
          {renderFilePreview(file, fileUrl)}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
