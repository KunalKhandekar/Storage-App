import { useGoogleLogin } from "@react-oauth/google";
import { BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../Apis/authApi";
import { useAuth } from "../Contexts/AuthContent";
import { useModal } from "../Contexts/ModalContext";
import { showSessionLimitExceedModal } from "../Utils/helpers";

export default function SocialAuthButtons({ setError, githubURL }) {
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const { code } = response;
      const res = await googleAuth(code);
      if (res.success) {
        setIsAuth(true);
        navigate("/");
      } else {
        if (res?.details?.sessionLimitExceed) {
          showSessionLimitExceedModal({
            showModal,
            showConfirmModal,
            closeConfirmModal,
            navigate,
            setIsAuth,
            token: res?.details?.temp_token,
          });
        }
        setError(res.message);
      }
    },
    onError: () => setError("Google login failed. Please try again."),
    ux_mode: "popup",
    flow: "auth-code",
  });

  return (
    <>
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {/* Google Sign-In Button - Following Google's Branding Guidelines */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {/* Google Logo SVG - Official Google Colors */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => (window.location.href = githubURL)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          <BsGithub />
          Continue with GitHub
        </button>
      </div>
    </>
  );
}
