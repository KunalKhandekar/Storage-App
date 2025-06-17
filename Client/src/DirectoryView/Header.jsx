import { ChevronDown, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ showUserDropdown, setShowUserDropdown }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  const getUserDetails = async () => {
    const res = await fetch("http://localhost:4000/user", {
      credentials: "include",
    });
    const data = await res.json();
    setUser(data);
  };
  
  useEffect(() => {
    getUserDetails();
  }, [navigate]);
  
  const Logout = async () => {
    await fetch("http://localhost:4000/user/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };
  
  const LogoutAll = async () => {
    await fetch("http://localhost:4000/user/logout-all", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };
  
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
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                <img
                  src={user.picture}
                  alt="user-Profile-Image"
                  className="w-full overflow-hidden rounded-full"
                />
              </div>
              <div className="text-left">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 min-w-48">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-sm">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  onClick={Logout}
                >
                  Logout
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  onClick={LogoutAll}
                >
                  Logout All Devices
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;