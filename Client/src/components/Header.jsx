import { Share2, Users, CloudUpload, UploadCloudIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../Apis/userApi";
import { MdSubscriptions } from "react-icons/md";
import { useStorage } from "../Contexts/StorageContext";
import { FaCloudUploadAlt } from "react-icons/fa";

const Header = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { setStorageData } = useStorage();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserDetails();
      if (res.success) {
        setUser(res.data);
        setStorageData({
          maxStorageLimit: res.data.maxStorageLimit,
          usedStorageLimit: res.data.usedStorageLimit,
          availableStorageLimit: res.data.availableStorageLimit,
        });
      } else {
        // TOAST
        console.error("Error:", res.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      <header className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center">
              <FaCloudUploadAlt  className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 max-[600px]:hidden">
              StoreMyStuff
            </h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Subscription Button */}
            <button
              onClick={() => navigate("/plans")}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              aria-label="Subscription"
            >
              <MdSubscriptions className="w-4 h-4" />
              <span className="font-medium hidden md:inline">
                Subscription
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => navigate("/share")}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              aria-label="Share Insights"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium hidden md:inline">
                Share Insights
              </span>
            </button>

            {/* User Management Button - Only for non-User roles */}
            {user.role !== "User" && (
              <button
                onClick={() => navigate("/users")}
                className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                aria-label="User Management"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium hidden lg:inline">
                  User Management
                </span>
              </button>
            )}

            {/* User Profile Button */}
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg transition-colors p-1.5 sm:p-2"
              aria-label="User Settings"
            >
              {/* User Text Info - Hidden on mobile */}
              <div className="text-right hidden lg:block">
                <div className="font-medium text-sm text-gray-900 truncate max-w-[150px]">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[150px]">
                  {user?.email}
                </div>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-blue-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;