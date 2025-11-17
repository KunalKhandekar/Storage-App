import { ArrowLeft, Share2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ finalFilteredFiles }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => navigate("/share")}
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
                <Users size={18} className="text-blue-600" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                Files Shared with Me
              </h1>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate ml-11">
              Access files others have shared with you
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
            <Share2 size={14} />
            <span>{finalFilteredFiles?.length || 0} files</span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
