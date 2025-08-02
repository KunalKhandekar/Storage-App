import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Eye,
  Loader2,
  MoveLeft,
  MoveRight,
  PhoneOutgoingIcon,
  Settings,
  Settings2,
  Share2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FileIcon, formatTime } from "../../Utils/helpers";
import { getShareDashboardInfo } from "../../Apis/shareApi";
import { useNavigate } from "react-router-dom";
import { GiIncomingRocket } from "react-icons/gi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sharedWithMe: 0,
    sharedByMe: 0,
    totalUsers: 0,
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getShareDashboardInfo();
      if (res.success) {
        setStats({
          sharedWithMe: res.data.sharedWithMeLength,
          sharedByMe: res.data.sharedByMeLength,
          totalUsers: res.data.collaborators,
        });
        setRecentFiles(res.data.recentFiles);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = (file) => {
    navigate(`/share/view/${file._id}`, { state: { file } });
  };

  const handleManagePermissions = (file) => {
    navigate(`/share/manage/${file._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-600" />
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Loading Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              Fetching your latest file sharing activity...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  File Sharing Dashboard
                </h1>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm">
                  Manage your shared files and collaborations seamlessly
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp size={14} />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Shared With Me Card */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                    <Share2 size={20} className="text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stats.sharedWithMe}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Shared With Me
                  </h3>
                  <p className="text-xs text-gray-600">
                    Files others have shared
                  </p>
                </div>
                <button
                  onClick={() => navigate("/share/shared-with-me")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 group/btn"
                >
                  View All Files
                  <ArrowRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform duration-200"
                  />
                </button>
              </div>
            </div>

            {/* Shared By Me Card */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stats.sharedByMe}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Shared By Me
                  </h3>
                  <p className="text-xs text-gray-600">Files you've shared</p>
                </div>
                <button
                  onClick={() => navigate("/share/shared-by-me")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 group/btn"
                >
                  Manage Files
                  <Settings2
                    size={14}
                    className="group-hover/btn:rotate-90 transition-transform duration-200"
                  />
                </button>
              </div>
            </div>

            {/* Collaborators Card */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                    <UserCheck size={20} className="text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Active users</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Collaborators
                  </h3>
                  <p className="text-xs text-gray-600">People you work with</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    Your shared files and collaborations will appear here once
                    you start sharing.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentFiles.map((file) => {
                    const isIncoming = file.type === "sharedWithMe";
                    const iconClass = `w-4 h-4 ${
                      isIncoming
                        ? "text-green-600 rotate-[-5deg]"
                        : "text-blue-600 rotate-[5deg]"
                    }`;
                    const boxClass = `p-2 rounded-md transition-colors duration-200 group-hover:bg-opacity-80 ${
                      isIncoming ? "bg-green-100" : "bg-blue-100"
                    }`;
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

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Quick Actions
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Common tasks to manage your files
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <button
                  onClick={() => navigate("/share/shared-with-me")}
                  className="group flex items-center space-x-4 p-4 sm:p-6 border border-gray-100 rounded-xl hover:shadow-md hover:shadow-blue-100/50 transition-all duration-200 text-left hover:border-blue-200 bg-gradient-to-r from-white to-blue-50/30"
                >
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                    <Share2 size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">
                      View Shared Files
                    </h3>
                    <p className="text-xs text-gray-600">
                      Access files others have shared with you
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200"
                  />
                </button>

                <button
                  onClick={() => navigate("/share/shared-by-me")}
                  className="group flex items-center space-x-4 p-4 sm:p-6 border border-gray-100 rounded-xl hover:shadow-md hover:shadow-green-100/50 transition-all duration-200 text-left hover:border-green-200 bg-gradient-to-r from-white to-green-50/30"
                >
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                    <Settings size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">
                      Manage Sharing
                    </h3>
                    <p className="text-xs text-gray-600">
                      Control access permissions for your files
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
