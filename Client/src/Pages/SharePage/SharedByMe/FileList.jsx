import {
  Clock,
  Eye,
  Globe,
  Settings,
  Share2,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatFileSize, formatTime, getFileIcon, PermissionBadge, UserAvatar } from "../../../Utils/helpers";

const FileList = ({ filteredFiles, searchTerm }) => {
  const navigate = useNavigate();
  const handleViewFile = (file) => {
    navigate(`/share/view/${file._id}`, {
      state: { file, route: `/file/${file._id}` },
    });
  };

  const handleManagePermissions = (file) => {
    navigate(`/share/manage/${file._id}`);
  };
  return (
    <div className="space-y-3 sm:space-y-4">
      {filteredFiles?.length === 0 ? (
        <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
            <Share2 size={28} className="sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
            No shared files found
          </h3>
          <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            {searchTerm
              ? `No files match "${searchTerm}". Try a different search term.`
              : "Files you share with others will appear here with sharing details."}
          </p>
        </div>
      ) : (
        filteredFiles?.map((file) => (
          <div
            key={file._id}
            className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-green-100/50 hover:bg-white transition-all duration-300 overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              {/* Mobile Layout */}
              <div className="block sm:hidden space-y-4">
                {/* File Info */}
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
                      {file.isSharedViaLink && (
                        <div className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          <Globe size={10} />
                          <span className="hidden xs:inline">Public</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{formatFileSize(file.size)}</span>
                      {file.sharedWith.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users size={10} />
                            {file.sharedWith.length}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(file.latestTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleManagePermissions(file)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <Settings size={14} />
                    <span>Manage</span>
                  </button>
                  <button
                    onClick={() => handleViewFile(file)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
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
                        {file.isSharedViaLink && (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                            <Globe size={10} />
                            <span>Public link</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                        <span>•</span>
                        {file.sharedWith.length > 0 && (
                          <>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {file.sharedWith.length}{" "}
                              {file.sharedWith.length === 1
                                ? "person"
                                : "people"}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Modified {formatTime(file.latestTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleManagePermissions(file)}
                      className="flex items-center gap-2 px-3 lg:px-4 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <Settings size={14} />
                      <span className="hidden md:inline">Manage</span>
                    </button>
                    <button
                      onClick={() => handleViewFile(file)}
                      className="flex items-center gap-2 px-3 lg:px-4 py-2 text-xs font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200"
                    >
                      <Eye size={14} />
                      <span className="hidden md:inline">View</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Shared Users Preview */}
              {file.sharedWith.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-700">
                      Shared with:
                    </span>
                    {file.sharedWith.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{file.sharedWith.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Mobile Shared Users */}
                  <div className="block sm:hidden space-y-2">
                    {file.sharedWith.slice(0, 2).map((share) => (
                      <div
                        key={share.user._id}
                        className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <UserAvatar user={share.user} size="w-6 h-6" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {share.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {share.user.email}
                          </p>
                        </div>
                        <PermissionBadge permission={share.permission} />
                      </div>
                    ))}
                    {file.sharedWith.length > 2 && (
                      <div className="text-center py-2">
                        <span className="text-xs text-gray-500">
                          +{file.sharedWith.length - 2} more people
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Desktop Shared Users */}
                  <div className="hidden sm:flex sm:flex-wrap gap-3">
                    {file.sharedWith.slice(0, 3).map((share) => (
                      <div
                        key={share.user._id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 min-w-0"
                      >
                        <UserAvatar user={share.user} size="w-7 h-7" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {share.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {share.user.email}
                          </p>
                        </div>
                        <PermissionBadge permission={share.permission} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FileList;
