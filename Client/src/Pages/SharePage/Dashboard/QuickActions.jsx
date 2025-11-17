import { ArrowRight, Settings, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
  );
};

export default QuickActions;
