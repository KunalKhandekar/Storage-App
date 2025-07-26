"use client";

import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Share2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getFileInfo } from "../../Apis/shareApi";
import { FileIcon, formatTime, renderFilePreview } from "../../Utils/helpers";


export default function FileViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileId } = useParams();
  const [file, setFile] = useState(location.state?.file);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Check if this is a self-view (user viewing their own file)
  const selfView = location.state?.route;

  // useEffect(() => {
  //   const fetchFileInfo = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await getFileInfo(fileId);
  //       if (response.success) {
  //         setFile(response.data.file);
  //       } else {
  //         setError("Failed to load file information");
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch file info:", error);
  //       setError("An error occurred while loading the file");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFileInfo();
  // }, [fileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
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
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to load file
          </h3>
          <p className="text-gray-600 mb-6">
            {error ||
              "The file you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          ? `link?token=${file?.isSharedViaLink?.token}`
          : "email"
      }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="group p-2 sm:p-2.5 hover:bg-white hover:shadow-md rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 flex-shrink-0"
              >
                <ArrowLeft
                  size={18}
                  className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900"
                />
              </button>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate"
                  title={file.name}
                >
                  {file.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {file.sharedBy ? (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                      <User size={14} />
                      <span className="truncate">
                        Shared by {file.sharedBy.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                      <Eye size={14} />
                      <span>Your file</span>
                    </div>
                  )}
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Clock size={12} />
                    <span>{formatTime(file.latestTime)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`${url}${
                  file.isSharedViaLink ? "action=download" : "?action=download"
                }`}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ExternalLink size={16} />
                <span className="hidden sm:inline">Open</span>
              </a>
            </div>
          </div>

          {/* File Info Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <FileIcon type={file.type} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h3
                      className="font-semibold text-gray-900 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="font-medium">{file.size}</span>
                      <span>•</span>
                      <span className="capitalize">{file.type} file</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {file.isSharedViaLink?.enabled
                        ? "Shared via link"
                        : "Shared directly"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Preview */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye size={20} />
                File Preview
              </h3>
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
  );
}
