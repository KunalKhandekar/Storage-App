"use client";

import {
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileInfo } from "../Apis/shareApi";
import FilePreview from "./RenderFile";
import { renderFilePreview } from "../Utils/helpers";

const GuestFileAccess = () => {
  const { fileId } = useParams();
  const [fileInfo, setFileInfo] = useState({
    fileUrl: "",
    name: "",
    sharedBy: "",
    isAccessible: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDisplayUrl = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getFileInfo(fileId);
      if (res.success) {
        setFileInfo({
          fileUrl: res.data.url,
          name: res.data.name,
          sharedBy: res.data.sharedBy,
          isAccessible: res.data.isAccessible,
        });
      } else {
        setError("Failed to load file information");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while loading the file");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) {
      getDisplayUrl();
    }
  }, [fileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Loading File
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your file...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load File
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={getDisplayUrl}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* File Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {fileInfo.name || "Untitled File"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Shared by {fileInfo.sharedBy || "Unknown User"}
                  </p>
                </div>
              </div>

              {fileInfo.fileUrl && (
                <div className="flex items-center space-x-3">
                  <a
                    href={`${fileInfo.fileUrl}&action=download`}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                  <a
                    href={fileInfo.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* File Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {fileInfo.isAccessible === null ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Checking Access
              </h3>
              <p className="text-gray-600">
                Verifying your permissions to view this file...
              </p>
            </div>
          ) : fileInfo.isAccessible ? (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  File Preview
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Preview of the shared content
                </p>
              </div>
              <div className="p-6">
                {renderFilePreview(fileInfo, fileInfo.fileUrl)}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Access Denied
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                This file is not accessible. The link may have expired, been
                revoked, or you may not have permission to view this content.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                File not accessible
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Secure file sharing • Protected by access controls
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestFileAccess;
