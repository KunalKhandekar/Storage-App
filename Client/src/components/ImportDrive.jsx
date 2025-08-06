import { useGoogleLogin } from "@react-oauth/google";
import { Cloud, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { driveConnect } from "../Apis/authApi";
import ProgressModal from "./Modals/ProgressModal";

const ImportDrive = ({ setActionDone }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const importFromDrive = useGoogleLogin({
    onSuccess: async (res) => {
      const { code } = res;
      // Start animation
      setIsModalOpen(true);
      setError("");
      setIsCompleted(false);

      try {
        const result = await driveConnect(code);
        if (result.success) {
          setIsCompleted(true);
        } else {
          setError(result.message || "Drive connection failed.");
        }
      } catch (err) {
        setError("Failed to connect to Google Drive");
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
    ux_mode: "popup",
    flow: "auth-code",
    scope:
      "openid email profile https://www.googleapis.com/auth/drive.readonly",
    access_type: "offline",
    prompt: "consent",
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
    setIsCompleted(false);
  };

  return (
    <>
      <button
        onClick={importFromDrive}
        className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-sm hover:shadow-md min-h-[48px] sm:min-w-[140px] lg:min-w-[160px]"
      >
        <svg
          className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        <span className="truncate">Import from Drive</span>
      </button>

      {isModalOpen && (
        <ProgressModal
          closeModal={closeModal}
          error={error}
          isCompleted={isCompleted}
          onComplete={() => {
            setActionDone(true);
            closeModal();
          }}
        />
      )}
    </>
  );
};

export default ImportDrive;
