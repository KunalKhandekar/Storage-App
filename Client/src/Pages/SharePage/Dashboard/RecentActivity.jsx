import { ArrowLeft, ArrowRight, Clock, Eye, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../../Utils/helpers";

const RecentActivity = ({ recentFiles }) => {
  const navigate = useNavigate();
  const handleViewFile = (file) => {
    navigate(`/share/view/${file._id}`, { state: { file } });
  };

  const handleManagePermissions = (file) => {
    navigate(`/share/manage/${file._id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Recent Activity
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Your latest shared files and collaborations
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {recentFiles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock size={28} className="text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
              No recent activity
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
              Your shared files and collaborations will appear here once you
              start sharing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentFiles.map((file) => {
              return (
                <div
                  key={`${file._id}-${file.type}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-gray-100 rounded-xl hover:shadow-md hover:shadow-gray-100/50 transition-all duration-200 hover:border-gray-200 bg-gradient-to-r from-white to-gray-50/30"
                >
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <div
                      className={`p-2 rounded-md shadow-sm transition-all duration-200 group ${
                        file.type === "sharedWithMe"
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-blue-100 hover:bg-blue-200"
                      }`}
                    >
                      {file.type === "sharedWithMe" ? (
                        <ArrowLeft className="text-green-600 w-4 h-4 rotate-[-20deg] transition-transform duration-200" />
                      ) : (
                        <ArrowRight className="text-blue-600 w-4 h-4 rotate-[-20deg] transition-transform duration-200" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {file.type === "sharedWithMe"
                          ? `Shared by ${file.sharedBy.name}`
                          : file.isSharedViaLink
                          ? "Shared with everyone by link"
                          : `Shared with ${
                              file.sharedWith?.length || 0
                            } people`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(file.latestTime)}
                    </span>
                    <button
                      onClick={() => {
                        if (file.type === "sharedWithMe") {
                          handleViewFile(file);
                        } else {
                          handleManagePermissions(file);
                        }
                      }}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 group/btn"
                    >
                      {file.type === "sharedWithMe" ? (
                        <>
                          <Eye size={14} />
                          <span className="hidden sm:inline">View</span>
                        </>
                      ) : (
                        <>
                          <Settings size={14} />
                          <span className="hidden sm:inline">Manage</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
