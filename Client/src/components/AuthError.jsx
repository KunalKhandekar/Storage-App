import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showSessionLimitExceedModal } from "../Utils/helpers";
import { useAuth } from "../Contexts/AuthContext";
import { useModal } from "../Contexts/ModalContext";

export default function AuthError() {
  const [params] = useSearchParams();
  const message = params.get("message");
  const loginToken = params.get("temp_token");
  const { checkAuthentication } = useAuth();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();
  useEffect(() => {
    if (loginToken) {
      showSessionLimitExceedModal({
        showModal,
        showConfirmModal,
        closeConfirmModal,
        checkAuthentication,
        token: loginToken,
      });
    }
  }, [loginToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Authentication Error
        </h2>
        <p className="text-gray-700">{message || "Something went wrong."}</p>
        <a
          href="/register"
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}
