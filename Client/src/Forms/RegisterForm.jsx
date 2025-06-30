import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
    console.log(resData);
    if (resData.success) {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${URL}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, action: "register" }),
      });

      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message);
      } else {
        setSuccess(resData.message);
        setCurrentStep("otp");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp: formData.otp,
        }),
      });

      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setFormData({ ...formData, otp: "" });
    await handleSendOTP({ preventDefault: () => {} });
  };

  const handleBackToCredentials = () => {
    setCurrentStep("credentials");
    setFormData({ ...formData, otp: "" });
    setError("");
    setSuccess("");
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
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              {currentStep === "credentials" &&
                "Enter your details to get started"}
              {currentStep === "otp" &&
                "Verify your email to complete registration"}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  currentStep === "credentials"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-green-500 border-green-500 text-white"
                }`}
              >
                1
              </div>
              <div
                className={`w-8 h-1 ${
                  currentStep === "otp" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  currentStep === "otp"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                2
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1: Credentials */}
            {currentStep === "credentials" && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-400"
                  />
                </div>

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
                    placeholder="Create a strong password"
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
                  <p className="text-sm text-blue-800">
                    We've sent a 4-digit verification code to
                  </p>
                  <p className="font-medium text-blue-900">{formData.email}</p>
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
                    ← Back to Details
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
              type="submit"
              onClick={
                currentStep === "credentials"
                  ? handleSendOTP
                  : handleFinalSubmit
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
                    ? "Sending..."
                    : "Creating Account..."}
                </div>
              ) : (
                <>
                  {currentStep === "credentials"
                    ? "Send Verification Code"
                    : "Create Account"}
                </>
              )}
            </button>
          </div>

          {/* Divider and Google Login - Only show on Credentials step */}
          {currentStep === "credentials" && (
            <>
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Google Login Button */}
              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
