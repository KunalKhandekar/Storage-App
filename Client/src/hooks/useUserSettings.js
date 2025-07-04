import { useState } from "react";
import { UserSettings } from "../Apis/userApi";

export default function useUserSettings({ showModal }) {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    picture: "",
  });
  const [originalProfileData, setOriginalProfileData] = useState({
    name: "",
    email: "",
    picture: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [hasManualPassword, setHasManualPassword] = useState(false);
  const [isSocialLogin, setSocialLogin] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState({});

  const hasProfileChanges = () => {
    return (
      profileData.name !== originalProfileData.name || selectedImage !== null
    );
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showModal("Invalid File", "Only image files are allowed.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showModal("File Too Large", "Image must be < 2MB", "error");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const getUserSettings = async () => {
    const res = await UserSettings();
    if (res.success) {
      const { name, email, picture, manualLogin, socialLogin, socialProvider } =
        res.data;
      const userData = { email, name, picture };
      setProfileData(userData);
      setOriginalProfileData(userData);
      setHasManualPassword(manualLogin);

      if (socialLogin) {
        setSocialLogin(true);
        setConnectedAccount({ provider: socialProvider, email });
      }
    } else {
      showModal("Error", "Failed to load user settings.", "error");
    }
  };

  return {
    profileData,
    setProfileData,
    originalProfileData,
    setOriginalProfileData,
    imagePreview,
    selectedImage,
    setImagePreview,
    setSelectedImage,
    passwordData,
    setPasswordData,
    hasManualPassword,
    setHasManualPassword,
    isSocialLogin,
    setSocialLogin,
    connectedAccount,
    setConnectedAccount,
    handleImageSelect,
    hasProfileChanges,
    getUserSettings
  };
}
