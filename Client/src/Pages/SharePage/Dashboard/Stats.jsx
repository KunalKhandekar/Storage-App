import {
    ArrowRight,
    Settings2,
    Share2,
    UserCheck,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Stats = ({stats}) => {
    const navigate = useNavigate();
  return (
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
            <p className="text-xs text-gray-600">Files others have shared</p>
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
  );
};

export default Stats;
