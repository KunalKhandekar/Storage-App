import { Camera, Save, Upload, User } from "lucide-react";
import { UpdateUserSettings } from "../../Apis/userApi";
import { useModal } from "../../Contexts/ModalContext";
import useUserSettings from "../../hooks/useUserSettings";

const ProfileSettings = ({
  profileData,
  setProfileData,
  setOriginalProfileData,
  imagePreview,
  selectedImage,
  setImagePreview,
  setSelectedImage,
  handleImageSelect,
  hasProfileChanges,
}) => {
  const { showModal } = useModal();

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("name", profileData.name);
    const res = await UpdateUserSettings(formData);
    if (res.success) {
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
    } else {
      showModal("Error", "Failed to update profile.", "error");
    }
  };

  return (
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
  );
};

export default ProfileSettings;
