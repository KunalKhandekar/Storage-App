import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleAuth, login, sendOTP } from "../../Apis/authApi";
import LoginCredentialForm from "../../components/Forms/LoginCredentialForm";
import OTPForm from "../../components/Forms/OTPForm";
import SocialAuthButtons from "../../components/SocialAuthButtons";
import StepProgress from "../../components/StepProgress";
import { useAuth } from "../../Contexts/AuthContext";
import { showSessionLimitExceedModal } from "../../Utils/helpers";
import { useModal } from "../../Contexts/ModalContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuth();
  const { showModal, showConfirmModal, closeConfirmModal } = useModal();

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

  const URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Verify and Send OTP
      const res = await sendOTP(email, "login", password);

      if (res.success) {
        setSuccess("Verification code sent to your email!");
        setCurrentStep("otp");
      } else {
        const message = res?.details
          ? res.details.map((d) => d.message).join(",\n")
          : res.message || "Something went wrong. Please try again.";

        setError(message);
      }
    } catch (err) {
      console.error("OTP send error:", err);
      setError("Something went wrong while sending OTP.");
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

    const { email, password, otp } = formData;
    const res = await login(email, password, otp);
    if (res.success) {
      await checkAuthentication();
    } else {
      if (res?.details?.sessionLimitExceed) {
        showSessionLimitExceedModal({
          showModal,
          showConfirmModal,
          closeConfirmModal,
          checkAuthentication,
          token: res?.details?.temp_token,
        });
      }

      setError(res.message);
    }
    setLoading(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
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

          <StepProgress currentStep={currentStep} />

          <div>
            <form
              className="space-y-6"
              onSubmit={
                currentStep === "credentials"
                  ? handleSendOTP
                  : handleOTPVerification
              }
            >
              {/* Step 1: Credentials */}
              {currentStep === "credentials" && (
                <LoginCredentialForm
                  handleChange={handleChange}
                  formData={formData}
                />
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === "otp" && (
                <OTPForm
                  formData={formData}
                  handleChange={handleChange}
                  handleBackToCredentials={handleBackToCredentials}
                  handleResendOTP={handleResendOTP}
                  loading={loading}
                />
              )}

              {/* Success & Error messages */}
              {success && (
                <div className="bg-green-100 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
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

              {/* Divider and Google Login - Only show on credentials step */}
              {currentStep === "credentials" && (
                <>
                  <SocialAuthButtons
                    setError={setError}
                    githubURL={`${URL}/auth/github`}
                  />
                </>
              )}
            </form>
          </div>

          {/* Sign up link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-medium text-blue-600 hover:underline transition-colors duration-200"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
