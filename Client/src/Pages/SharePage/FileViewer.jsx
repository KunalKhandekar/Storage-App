import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Pen,
  Share2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatTime, renderFilePreview } from "../../Utils/helpers";
import RenameModal from "../DirectoryPage/RenameModal";
import { renameFileAsEditor } from "../../Apis/shareApi";

export default function FileViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileId } = useParams();
  const [file, setFile] = useState(location.state?.file);
  const [fileType, _] = useState(location.state?.type);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRenameModal, setIsRenameModal] = useState(false);
  const selfView = location.state?.route;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Unable to load file
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            {error ||
              "The file you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const url = selfView
    ? `http://localhost:4000${selfView}?`
    : `http://localhost:4000/file/share/access/${file._id}/${
        file?.isSharedViaLink
          ? `link?token=${file?.shareViaLink?.token}`
          : "email"
      }`;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="group p-2 sm:p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <ArrowLeft
                      size={16}
                      className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Eye size={18} className="text-blue-600" />
                      </div>
                      <h1
                        className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate"
                        title={file.name}
                      >
                        {file.name}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1 ml-11">
                      {file.sharedBy ? (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <User size={12} />
                          <span className="truncate">
                            Shared by {file.sharedBy.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <Eye size={12} />
                          <span>Your file</span>
                        </div>
                      )}
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={10} />
                        <span>{formatTime(file.latestTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                    <Share2 size={14} />
                    <span>
                      {file.isSharedViaLink
                        ? "Shared via link"
                        : "Shared directly"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              {file.permission === "editor" && (
                <button
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setIsRenameModal(true)}
                >
                  <Pen size={14} />
                  <span className="hidden sm:inline">Rename</span>
                </button>
              )}
              <a
                href={`${url}${
                  file.isSharedViaLink ? "action=download" : "?action=download"
                }`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Download</span>
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Open</span>
              </a>
            </div>

            {/* File Preview */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye size={18} className="text-blue-600" />
                  </div>
                  <h3 className="text-sm lg:text-base font-medium text-gray-900">
                    File Preview
                  </h3>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div
                  className="w-full"
                  style={{ height: "calc(100vh - 400px)", minHeight: "400px" }}
                >
                  {renderFilePreview(file, url)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isRenameModal && file.permission === "editor" && (
        <RenameModal
          item={{ ...file, type: "file" }}
          onClose={() => setIsRenameModal(false)}
          onRename={(res) => {
            const updatedFile = { ...file, name: res?.data?.name };
            setFile(updatedFile);
            navigate(".", {
              replace: true,
              state: { ...location.state, file: updatedFile },
            });
            setIsRenameModal(false);
          }}
          ApiFunc={renameFileAsEditor}
        />
      )}
    </>
  );
}
