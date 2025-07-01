import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GitHubButton from "../components/GithubButton";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  // Step tracking: 'credentials' -> 'otp'
  const [currentStep, setCurrentStep] = useState("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const URL = "http://localhost:4000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const otpRes = await fetch(`${URL}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: formData.email, action: "login" }),
      });

      const otpData = await otpRes.json();

      if (!otpData.success) {
        setError(otpData.message);
      } else {
        setSuccess("Verification code sent to your email!");
        setCurrentStep("otp");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          otp: formData.otp,
        }),
        credentials: "include",
      });

      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setFormData({ ...formData, otp: "" });
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${URL}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("New verification code sent!");
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setCurrentStep("credentials");
    setFormData({ ...formData, otp: "" });
    setError("");
    setSuccess("");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    console.log("Google Login Success:", credentialResponse);
    const res = await fetch(`${URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentialResponse),
    });

    const resData = await res.json();
    if (resData.success) {
      navigate("/");
    } else {
      setError(resData.message);
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStep === "credentials"
                ? "Welcome Back"
                : "Verify Your Identity"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {currentStep === "credentials"
                ? "Please sign in to your account"
                : "Enter the verification code sent to your email"}
            </p>
          </div>

          {/* Progress indicator for OTP step */}
          {currentStep === "otp" && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-green-500 border-green-500 text-white">
                  ✓
                </div>
                <div className="w-8 h-1 bg-green-500"></div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-indigo-600 border-indigo-600 text-white">
                  2
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="space-y-6">
              {/* Step 1: Credentials */}
              {currentStep === "credentials" && (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === "otp" && (
                <>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-800">
                        Credentials Verified
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Verification code sent to {formData.email}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      name="otp"
                      placeholder="Enter 4-digit code"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength="4"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400 text-center text-lg tracking-widest"
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      type="button"
                      onClick={handleBackToCredentials}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      ← Back to Login
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-indigo-600 hover:text-indigo-500 font-medium disabled:text-gray-400"
                    >
                      Resend Code
                    </button>
                  </div>
                </>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={
                  currentStep === "credentials"
                    ? handleCredentialSubmit
                    : handleOTPVerification
                }
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {currentStep === "credentials"
                      ? "Verifying..."
                      : "Confirming..."}
                  </div>
                ) : currentStep === "credentials" ? (
                  "Sign In"
                ) : (
                  "Verify & Login"
                )}
              </button>
            </div>
          </div>

          {/* Divider and Google Login - Only show on credentials step */}
          {currentStep === "credentials" && (
            <>
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons Container */}
              <div className="mt-6 space-y-3">
                {/* Google Login Button */}
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </div>

                {/* GitHub Login Button - Custom styled to match Google */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${URL}/auth/github`;
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1DA1F2"
                      d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                    />
                  </svg>
                  Twitter
                </button>
              </div>
            </>
          )}

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
