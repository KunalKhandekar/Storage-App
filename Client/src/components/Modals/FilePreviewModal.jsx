import { Download, ExternalLink, X, File, Image, Music } from "lucide-react";

const FilePreviewModal = ({ file, onClose }) => {
  const fileUrl = `http://localhost:4000/user/${file.userId}/file/${file._id}`;

  const getFileExtension = (name) => name.split(".").pop().toLowerCase();

  const renderFilePreview = () => {
    const ext = getFileExtension(file.name);

    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return (
          <div className="flex items-center justify-center min-h-96 bg-gray-50 rounded-lg">
            <img
              src={fileUrl}
              alt={file.name}
              className="max-w-full max-h-96 object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div className="hidden text-center">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Failed to load image</p>
            </div>
          </div>
        );

      case "pdf":
      case "txt":
        return (
          <iframe
            src={fileUrl}
            className="w-full h-96 rounded-lg border-0"
            title={file.name}
          />
        );

      case "mp4":
      case "webm":
      case "ogg":
        return (
          <div className="flex justify-center bg-gray-50 rounded-lg p-4">
            <video
              controls
              className="max-w-full max-h-96 rounded-lg"
              src={fileUrl}
            />
          </div>
        );

      case "mp3":
      case "wav":
        return (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Music className="w-10 h-10 text-purple-500 mx-auto mb-4" />
            <audio controls className="w-full max-w-md mx-auto" src={fileUrl} />
          </div>
        );

      default:
        return (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <File className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Preview not available</p>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0  bg-black/30 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
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
          {renderFilePreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
