import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Upload,
  Github,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BsGithub, BsGoogle } from "react-icons/bs";

// Modal Component
const Modal = ({ isOpen, onClose, title, children, type = "info" }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return { icon: CheckCircle, color: "text-green-600" };
      case "error":
        return { icon: AlertCircle, color: "text-red-600" };
      case "warning":
        return { icon: AlertCircle, color: "text-yellow-600" };
      default:
        return { icon: AlertCircle, color: "text-blue-600" };
    }
  };

  const { icon: Icon, color } = getIconAndColor();

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`${color} w-6 h-6`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "danger":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const { icon: Icon, color, buttonColor } = getIconAndColor();

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Icon className={`${color} w-6 h-6`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-gray-600 mb-6">{message}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    picture: "",
  });

  // Original profile data for comparison
  const [originalProfileData, setOriginalProfileData] = useState({
    name: "",
    email: "",
    picture: "",
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // User has social login but no manual password set
  const [hasManualPassword, setHasManualPassword] = useState(false);
  const [isSocialLogin, setSocialLogin] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState({
    provider: "",
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const BASE_URL = "http://localhost:4000";

  // Check if profile has changes
  const hasProfileChanges = () => {
    return (
      profileData.name !== originalProfileData.name || selectedImage !== null
    );
  };

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const showConfirmModal = (title, message, onConfirm, type = "warning") => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "info" });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      type: "warning",
    });
  };

  const getUserSettings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/settings`, {
        credentials: "include",
      });
      const resData = await res.json();
      if (resData.success) {
        const {
          name,
          email,
          picture,
          manualLogin,
          socialLogin,
          socialProvider,
        } = resData.data;

        const userData = { email, name, picture };
        setProfileData(userData);
        setOriginalProfileData(userData);

        setHasManualPassword(manualLogin);
        if (socialLogin) {
          setConnectedAccount({
            provider: socialProvider,
            email,
          });
          setSocialLogin(true);
        }
      }
    } catch (error) {
      console.log(error);
      showModal(
        "Error",
        "Failed to load user settings. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    getUserSettings();
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showModal(
          "Invalid File",
          "Please select a valid image file (JPG, PNG, or GIF).",
          "error"
        );
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        showModal(
          "File Too Large",
          "Please select an image smaller than 2MB.",
          "error"
        );
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedImage); // Image file
      formData.append("name", profileData.name); // Name or other fields

      const response = await fetch(`${BASE_URL}/user/updateProfile`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      console.log(data);

      showModal("Success", "Profile updated successfully!", "success");

      setSelectedImage(null);
      setImagePreview(null);

      setOriginalProfileData({
        ...profileData,
        picture: imagePreview || profileData.picture,
      });

      if (imagePreview) {
        setProfileData((prev) => ({
          ...prev,
          picture: imagePreview,
        }));
      }
    } catch (error) {
      showModal(
        "Error",
        "Failed to update profile. Please try again.",
        "error"
      );
    }
  };

  const setPassword = async () => {
    const res = await fetch(`${BASE_URL}/user/setPassword`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: passwordData.confirm }),
    });

    return res.json();
  };

  const updatePassword = async () => {
    const res = await fetch(`${BASE_URL}/user/updatePassword`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: passwordData.current,
        newPassword: passwordData.confirm,
      }),
    });

    return res.json();
  };

  const handlePasswordAction = async () => {
    if (!hasManualPassword) {
      // Setting password for first time
      if (passwordData.new !== passwordData.confirm) {
        showModal("Password Mismatch", "Passwords do not match!", "error");
        return;
      }
      try {
        const response = await setPassword();
        if (response.success) {
          showModal(
            "Success",
            "Password set successfully! You can now login manually.",
            "success"
          );
          setHasManualPassword(true);
          setPasswordData({ current: "", new: "", confirm: "" });
        } else {
          showModal("Error", response.message, "error");
        }
      } catch (error) {
        showModal(
          "Error",
          "Failed to set password. Please try again.",
          "error"
        );
      }
    } else {
      // Changing existing password
      if (passwordData.new !== passwordData.confirm) {
        showModal("Password Mismatch", "New passwords do not match!", "error");
        return;
      }

      try {
        const response = await updatePassword();
        if (response.success) {
          showModal("Success", "Password updated successfully!", "success");
          setPasswordData({ current: "", new: "", confirm: "" });
        } else {
          showModal("Error", response.message, "error");
        }
      } catch (error) {
        showModal(
          "Error",
          "Failed to update password. Please try again.",
          "error"
        );
      }
    }
  };

  const handleAccountDelete = () => {
    showConfirmModal(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.",
      () => {
        // Implement account deletion logic here
        showModal("Success", "Account deleted successfully!", "success");
        closeConfirmModal();
      },
      "danger"
    );
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 204) {
        showModal("Success", "Logged out successfully!", "success");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      showModal("Error", "Failed to logout. Please try again.", "error");
    }
  };

  const handleLogoutAll = async () => {
    showConfirmModal(
      "Logout All Devices",
      "Are you sure you want to logout from all devices? You will need to login again on all your devices.",
      async () => {
        try {
          const res = await fetch(`${BASE_URL}/user/logout-all`, {
            method: "POST",
            credentials: "include",
          });
          if (res.status === 204) {
            showModal(
              "Success",
              "Logged out from all devices successfully!",
              "success"
            );
            setTimeout(() => navigate("/login"), 1500);
          }
        } catch (error) {
          showModal(
            "Error",
            "Failed to logout from all devices. Please try again.",
            "error"
          );
        }
        closeConfirmModal();
      },
      "warning"
    );
  };

  const getSocialIcon = (provider) => {
    const iconClass = "w-6 h-6";

    if (provider === "google") {
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    }

    if (provider === "github") {
      return <BsGithub className="text-black w-6 h-6" />;
    }

    return <div className="w-6 h-6 bg-gray-300 rounded" />;
  };

  const handleAccountDisable = () => {
    showConfirmModal(
      "Disable Account",
      "Are you sure you want to disable your account? This action will hide your profile and stop notifications. You can reactivate it later by contacting our support team.",
      async () => {
        try {
          const res = await fetch(`${BASE_URL}/user/disable`, {
            method: "PATCH",
            credentials: "include",
          });

          const data = await res.json();

          if (data.success) {
            showModal(
              "Account Disabled",
              "Your account has been disabled. You can contact support to reactivate it anytime.",
              "success"
            );
            setTimeout(() => navigate("/login"), 2000);
          } else {
            showModal(
              "Error",
              data.message || "Something went wrong.",
              "error"
            );
          }
        } catch (err) {
          showModal(
            "Error",
            "Failed to disable account. Please try again.",
            "error"
          );
        }

        closeConfirmModal();
      },
      "warning"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <User className="mr-2" size={20} />
              Profile Settings
            </h2>

            {/* Profile Picture */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                Profile Picture
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 space-x-4 sm:gap-5">
                <img
                  src={imagePreview || profileData.picture}
                  alt="User Profile"
                  className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-gray-200 mx-auto sm:mx-0"
                />
                <div className="">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Camera size={16} />
                    <span>Upload New Picture</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1 text-center sm:text-left">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                  {selectedImage && (
                    <p className="text-sm text-green-600 mt-1 flex items-center justify-center sm:justify-start">
                      <Upload size={14} className="mr-1" />
                      {selectedImage.name} selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed once set.
                </p>
              </div>

              <button
                onClick={handleProfileUpdate}
                disabled={!hasProfileChanges()}
                className={`w-full sm:w-auto px-6 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 ${
                  hasProfileChanges()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Save size={16} />
                <span>Update Profile</span>
              </button>
            </div>
          </div>

          {/* Connected Account */}
          {isSocialLogin && (
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Connected Account
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  {getSocialIcon(connectedAccount.provider)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {connectedAccount.provider === "google"
                        ? "Google"
                        : "GitHub"}
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      {connectedAccount.email}
                    </p>
                  </div>
                </div>
                <div className="sm:flex items-center justify-center sm:justify-end hidden">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Only one social account can be connected at a time. This account
                is used for authentication.
              </p>
            </div>
          )}

          {/* Password Settings */}
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
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
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
                  {hasManualPassword
                    ? "Confirm New Password"
                    : "Confirm Password"}
                </label>
                <div className="relative">
                  <input
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
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordAction}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {hasManualPassword ? "Change Password" : "Set Password"}
              </button>
            </div>
          </div>

          {/* Logout Options */}
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
                    <h3 className="font-medium text-gray-900">
                      Current Device
                    </h3>
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
                    <p className="text-sm text-gray-600">
                      Logout from all devices
                    </p>
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

          {/* Disable Account */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-red-900 mb-4 flex items-center">
              <Trash2 className="mr-2" size={20} />
              Disable My Account
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-2">
                ⚠️ This action is temporary and can be reversed.
              </p>
              <p className="text-gray-700 text-sm">
                Disabling your account will hide your profile and stop all email
                or app notifications. Your data will be retained securely and
                can be restored anytime by contacting our support team.
              </p>
            </div>
            <button
              onClick={handleAccountDisable}
              className="w-full sm:w-auto bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              Disable Account
            </button>
          </div>

          {/* Delete Account */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-red-900 mb-4 flex items-center">
              <Trash2 className="mr-2" size={20} />
              Delete My Account
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800 font-medium mb-2">
                ⚠️ This action cannot be undone
              </p>
              <p className="text-red-700 text-sm">
                Deleting your account will permanently remove all your data,
                files, and settings. You will lose access to all connected
                services and this action cannot be reversed.
              </p>
            </div>
            <button
              onClick={handleAccountDelete}
              className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        {modal.message}
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
}
