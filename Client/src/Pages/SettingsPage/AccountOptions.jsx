import { useNavigate } from "react-router-dom";
import { deleteAccount, disableAccount } from "../../Apis/userApi";
import { Trash2 } from "lucide-react";
import { useModal } from "../../Contexts/ModalContext";
import { useAuth } from "../../Contexts/AuthContext";

const AccountOptions = ({
  option,
}) => {
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();

  const styles = {
    delete: {
      color: "red",
      iconColor: "text-red-900",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    disable: {
      color: "yellow",
      iconColor: "text-yellow-900",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600 text-black",
    },
  };

  const handlers = {
    delete: {
      buttonTag: "Delete Account Permanently",
      headerTag: "Delete My Account",
      subject: "⚠️ This action cannot be undone",
      Info: "Deleting your account will permanently remove all your data, files, and settings. You will lose access to all connected services and this action cannot be reversed.",
      handler: () => {
        showConfirmModal(
          "Delete Account",
          "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.",
          async () => {
            const res = await deleteAccount();

            if (res.success) {
              showModal("Account Deleted", "Your account has been deleted.");
              setIsAuth(false);
              setTimeout(() => navigate("/login"), 1000);
            } else {
              showModal(
                "Error",
                res.message || "Something went wrong.",
                "error"
              );
            }
            closeConfirmModal();
          },
          "danger"
        );
      },
    },
    disable: {
      buttonTag: "Disable Account",
      headerTag: "Disable My Account",
      subject: "⚠️ This action is temporary and can be reversed.",
      Info: "Disabling your account will hide your profile and stop all email or app notifications. Your data will be retained securely and can be restored anytime by contacting our support team.",
      handler: () => {
        showConfirmModal(
          "Disable Account",
          "Are you sure you want to disable your account? This will hide your profile and stop notifications. You can reactivate it later by contacting our support team.",
          async () => {
            const res = await disableAccount();
            if (res.success) {
              showModal(
                "Account Disabled",
                "Your account has been disabled. Contact support@storemystuff.cloud to reactivate.",
                "success"
              );
              setIsAuth(false)
              setTimeout(() => navigate("/login"), 1000);
            } else {
              showModal(
                "Error",
                res.message || "Something went wrong.",
                "error"
              );
            }
            closeConfirmModal();
          },
          "warning"
        );
      },
    },
  };

  const { buttonTag, headerTag, subject, Info, handler } = handlers[option];

  const { iconColor, bgColor, borderColor, textColor, buttonColor } =
    styles[option];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border ${borderColor} p-4 sm:p-6`}
    >
      <h2
        className={`text-lg sm:text-xl font-semibold ${iconColor} mb-4 flex items-center`}
      >
        <Trash2 className="mr-2" size={20} />
        {headerTag}
      </h2>
      <div className={`${bgColor} border ${borderColor} rounded-md p-4 mb-4`}>
        <p className={`font-medium mb-2 ${textColor}`}>{subject}</p>
        <p className={`text-sm ${textColor}`}>{Info}</p>
      </div>
      <button
        onClick={handler}
        className={`w-full sm:w-auto ${buttonColor} px-6 py-2 rounded-md transition-colors font-medium text-white`}
      >
        {buttonTag}
      </button>
    </div>
  );
};

export default AccountOptions;
