import { Share2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../Apis/userApi";

const Header = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserDetails();
      if (res.success) {
        setUser(res.data);
      } else {
        // TOAST
        console.error("Error:", res.message);
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="sticky top-0 z-50 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      <header className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">File Manager</h1>
          </div>

          {/* Right actions */}
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <button
                onClick={() => navigate("/share")}
                className="flex items-center space-x-2 px-2 py-2 md:px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Share Insights</span>
              </button>
            {/* User Management Button */}
            {user.role !== "User" && (
              <button
                onClick={() => navigate("/users")}
                className="flex items-center space-x-2 px-2 py-2 md:px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">User Management</span>
              </button>
            )}

            {/* User Info & Avatar */}
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-2 md:space-x-3 hover:bg-gray-50 rounded-lg transition-colors p-2"
            >
              {/* User Text Info */}
              <div className="text-right hidden sm:block">
                <div className="font-medium text-sm text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
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
