import {
  Archive,
  Edit3,
  Eye,
  File,
  FileBoxIcon,
  FileText,
  ImageIcon,
  ImageUp,
  Music,
  Video,
} from "lucide-react";
import { regenerateSession } from "../Apis/authApi";

export const UserAvatar = ({ user, size = "w-8 h-8" }) => (
  <div className={`${size} rounded-full overflow-hidden flex-shrink-0`}>
    <img
      src={user.picture || "/placeholder.svg"}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  </div>
);

export const PermissionBadge = ({ permission }) => (
  <div
    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
      permission === "editor"
        ? "bg-orange-100 text-orange-700 border border-orange-200"
        : "bg-blue-100 text-blue-700 border border-blue-200"
    }`}
  >
    {permission === "editor" ? <Edit3 size={10} /> : <Eye size={10} />}
    <span className="capitalize">{permission}</span>
  </div>
);

export const FileIcon = ({ type, size = 24 }) => {
  const iconProps = { size, className: "text-gray-600" };

  switch (type?.toLowerCase()) {
    case ".pdf":
      return <FileText {...iconProps} className="text-red-500" />;
    case ".zip":
    case ".rar":
      return <Archive {...iconProps} className="text-yellow-500" />;
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
      return <ImageIcon {...iconProps} className="text-green-500" />;
    case ".mp4":
    case ".avi":
    case ".mov":
    case ".video":
      return <Video {...iconProps} className="text-purple-500" />;
    case ".mp3":
    case ".wav":
      return <Music {...iconProps} className="text-blue-500" />;
    default:
      return <FileBoxIcon {...iconProps} />;
  }
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (timeString) => {
  const date = new Date(timeString);
  const now = new Date();

  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMs < 60 * 1000) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${diffInDays}d ago`;
  if (diffInDays < 365) return `${diffInMonths}mo ago`;
  return `${diffInYears}y ago`;
};

const getFileExtension = (name) => name.split(".").pop().toLowerCase();

export const renderFilePreview = (file, fileUrl) => {
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
            <ImageUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load image</p>
          </div>
        </div>
      );

    case "pdf":
    case "txt":
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[80vh] rounded"
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
          <a
            href={fileUrl}
            download={file.name}
            className="inline-block bg-blue-500 mt-3 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl transition duration-200"
          >
            Download {file.name}
          </a>
        </div>
      );
  }
};

export const showSessionLimitExceedModal = ({
  showModal,
  showConfirmModal,
  closeConfirmModal,
  navigate,
  setIsAuth,
  token,
}) => {
  showConfirmModal(
    "Session Limit Exceeded",
    "You are already logged in on two devices. To continue, one of your previous sessions must be logged out. Would you like to force logout from the older sessions and continue here?",
    async () => {
      const res = await regenerateSession(token);
      if (res.success) {
        setIsAuth(true);
        navigate("/");
      } else {
        showModal("Error", res.message || "Something went wrong.", "error");
      }
      closeConfirmModal();
    },
    "warning"
  );
};
