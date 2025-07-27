import { LogOut } from "lucide-react";
import { logout, logoutAll } from "../../Apis/authApi";
import { useModal } from "../../Contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContent";

const LogoutOptions = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      showModal("Success", "Logged out successfully!", "success");
      setIsAuth(false);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      showModal("Error", "Logout failed", "error");
    }
  };

  const handleLogoutAll = async () => {
    showConfirmModal(
      "Logout All Devices",
      "Are you sure you want to logout from all devices?",
      async () => {
        const res = await logoutAll();
        if (res.success) {
          showModal("Success", "Logged out from all devices!", "success");
          setIsAuth(false);
          setTimeout(() => navigate("/login"), 1000);
          closeConfirmModal();
        } else {
          showModal("Error", "Failed to logout all.", "error");
        }
      },
      "warning"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <LogOut className="mr-2" size={20} />
        Logout Options
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <LogOut size={18} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Current Device</h3>
              <p className="text-sm text-gray-600">
                Logout from this device only
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut size={18} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">All Devices</h3>
              <p className="text-sm text-gray-600">Logout from all devices</p>
            </div>
          </div>
          <button
            onClick={handleLogoutAll}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout All
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutOptions;
