import { Clock, Edit3, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatFileSize,
  formatTime,
  getFileIcon,
  PermissionBadge,
  UserAvatar
} from "../../../Utils/helpers";

const FileList = ({ finalFilteredFiles, searchTerm, filter }) => {
  const navigate = useNavigate();
  const handleViewFile = (file) => {
    navigate(`/share/view/${file._id}`, {
      state: { file },
    });
  };
  return (
    <div className="space-y-3 sm:space-y-4">
      {finalFilteredFiles.length === 0 ? (
        <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Users size={28} className="sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
            {searchTerm || filter !== "all"
              ? "No files found"
              : "No files shared with you"}
          </h3>
          <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            {searchTerm
              ? `No files match "${searchTerm}". Try a different search term.`
              : filter !== "all"
              ? `No files with ${
                  filter === "viewer" ? "view only" : "edit"
                } permissions found.`
              : "When someone shares a file with you, it will appear here."}
          </p>
        </div>
      ) : (
        finalFilteredFiles.map((file) => (
          <div
            key={file._id}
            className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-blue-100/50 hover:bg-white transition-all duration-300 overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              {/* Mobile Layout */}
              <div className="block sm:hidden space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight"
                        title={file.name}
                      >
                        {file.name}
                      </h3>
                      <PermissionBadge permission={file.permission} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>Shared by {file.sharedBy.name}</span>
                      <span>•</span>
                      <span className="font-medium">{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(file.latestTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserAvatar user={file.sharedBy} size="w-6 h-6" />
                        <span className="text-xs text-gray-600 truncate">
                          {file.sharedBy.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewFile(file)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      >
                        {file.permission === "editor" ? (
                          <>
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </>
                        ) : (
                          <>
                            <Eye size={12} />
                            <span>View</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-200">
                   {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className="text-sm lg:text-base font-medium text-gray-900 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </h3>
                      <PermissionBadge permission={file.permission} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Shared by {file.sharedBy.name}</span>
                      <span>•</span>
                      <span className="font-medium">{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(file.latestTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserAvatar user={file.sharedBy} size="w-8 h-8" />
                  <button
                    onClick={() => handleViewFile(file)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                  >
                    {file.permission === "editor" ? (
                      <>
                        <Edit3 size={14} />
                        <span className="hidden md:inline">Edit</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span className="hidden md:inline">View</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FileList;
