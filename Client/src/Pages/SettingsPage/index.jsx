import { useEffect } from "react";

import { useModal } from "../../Contexts/ModalContext";
import useUserSettings from "../../hooks/useUserSettings";
import AccountOptions from "./AccountOptions";
import ConnectedAccount from "./ConnectedAccount";
import LogoutOptions from "./LogoutOptions";
import PasswordSettings from "./PasswordSettings";
import ProfileSettings from "./ProfileSettings";
import StorageUsage from "./StorageUsage";
import { useStorage } from "../../Contexts/StorageContext";

export default function SettingsPage() {
  const { showModal } = useModal();
  const { storageData, setStorageData } = useStorage();
  const {
    isSocialLogin,
    connectedAccount,
    profileData,
    getUserSettings,
    setProfileData,
    setOriginalProfileData,
    imagePreview,
    selectedImage,
    setImagePreview,
    setSelectedImage,
    handleImageSelect,
    hasProfileChanges,
    passwordData,
    setPasswordData,
    hasManualPassword,
    setHasManualPassword,
  } = useUserSettings({ showModal, setStorageData });

  
  useEffect(() => {
    getUserSettings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <StorageUsage
          maxStorageLimit={storageData.maxStorageLimit}
          usedStorageLimit={storageData.usedStorageLimit}
        />

        <ProfileSettings
          profileData={profileData}
          setProfileData={setProfileData}
          setOriginalProfileData={setOriginalProfileData}
          imagePreview={imagePreview}
          selectedImage={selectedImage}
          setImagePreview={setImagePreview}
          setSelectedImage={setSelectedImage}
          handleImageSelect={handleImageSelect}
          hasProfileChanges={hasProfileChanges}
        />

        {isSocialLogin && (
          <ConnectedAccount connectedAccount={connectedAccount} />
        )}

        <PasswordSettings
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          hasManualPassword={hasManualPassword}
          setHasManualPassword={setHasManualPassword}
        />

        <LogoutOptions />

        <AccountOptions option="disable" />
        <AccountOptions option="delete" />
      </div>
    </div>
  );
}
