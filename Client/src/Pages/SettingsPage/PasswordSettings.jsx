import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { setPassword, updatePassword } from "../../Apis/authApi";
import { useModal } from "../../Contexts/ModalContext";

const PasswordSettings = ({
  passwordData,
  setPasswordData,
  hasManualPassword,
  setHasManualPassword,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { showModal } = useModal();

  const handlePasswordAction = async () => {
    const { current, new: newPass, confirm } = passwordData;


    if (newPass !== confirm) {
      showModal("Mismatch", "New passwords do not match!", "error");
      return;
    }

    if (newPass.length <= 3) {
      showModal(
        "Invalid",
        "Password must be longer than 3 characters!",
        "error"
      );
      return;
    }

    if (hasManualPassword && current === confirm) {
      showModal("Invalid", "Old and New password cannot be same!", "error");
      return;
    }


    const res = hasManualPassword
      ? await updatePassword(current, confirm)
      : await setPassword(confirm);

    if (res.success) {
      showModal(
        "Success",
        hasManualPassword
          ? "Password updated successfully!"
          : "Password set successfully!",
        "success"
      );
      if (!hasManualPassword) setHasManualPassword(true);
      setPasswordData({ current: "", new: "", confirm: "" });
    } else {
      showModal("Error", res.message, "error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <Lock className="mr-2" size={20} />
        {hasManualPassword
          ? "Change Password"
          : "Set Password for Manual Login"}
      </h2>

      <div className="mb-4">
        <p className="text-gray-600 text-sm sm:text-base">
          {hasManualPassword
            ? "Update your password for manual login access."
            : "Set a password to enable manual login in addition to your social login."}
        </p>
      </div>

      <div className="space-y-4">
        {hasManualPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                tabIndex={1}
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current: e.target.value,
                  })
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {hasManualPassword ? "New Password" : "Password"}
          </label>
          <div className="relative">
            <input
              tabIndex={2}
              type={showNewPassword ? "text" : "password"}
              value={passwordData.new}
              onChange={(e) =>
                setPasswordData({ ...passwordData, new: e.target.value })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {hasManualPassword ? "Confirm New Password" : "Confirm Password"}
          </label>
          <div className="relative">
            <input
              tabIndex={3}
              type={showConfirmPassword ? "text" : "password"}
              value={passwordData.confirm}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          tabIndex={4}
          onClick={handlePasswordAction}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {hasManualPassword ? "Change Password" : "Set Password"}
        </button>
      </div>
    </div>
  );
};

export default PasswordSettings;
