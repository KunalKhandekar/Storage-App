import { GoogleLogin } from "@react-oauth/google";
import { BsGithub } from "react-icons/bs";

export default function SocialAuthButtons({
  onGoogleSuccess,
  onGoogleError,
  githubURL,
}) {
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
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            shape="rectangular"
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = githubURL)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50"
        >
          <BsGithub />
          Continue with GitHub
        </button>
      </div>
    </>
  );
}
