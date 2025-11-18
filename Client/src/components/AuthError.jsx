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
  const navigate = useNavigate();

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
   <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Error Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          {/* Error Icon */}
        <div className="flex justify-center my-4 pt-8">
          <div className="bg-red-50 rounded-full p-4">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

          <div className="p-8 pt-0 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Authentication Error
            </h1>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              {message || "Something went wrong during authentication. Please try again."}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2" onClick={() => navigate("/login")}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            If the problem persists, please contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
}