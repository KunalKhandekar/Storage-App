import { Users } from "lucide-react";
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
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">File Manager</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user.role !== "User" && (
            <button
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              onClick={() => navigate("/users")}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">User Management</span>
            </button>
          )}

          {/* User Profile - Clickable to Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg transition-colors p-2"
          >
            <div className="text-right">
              <div className="font-medium text-sm text-gray-900">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              <img
                src={user.picture}
                alt="user-Profile-Image"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
