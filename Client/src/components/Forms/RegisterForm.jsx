import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../components/StepProgress";
import CredentialsForm from "../../components/Forms/CredentialsForm";
import OTPForm from "../../components/Forms/OTPForm";
import SocialAuthButtons from "../../components/SocialAuthButtons";
import { googleAuth, register, sendOTP } from "../../Apis/authApi";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [currentStep, setCurrentStep] = useState("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const URL = "http://localhost:4000";

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
    const res = await sendOTP(formData.email, "register");
    setLoading(false);

    if (res.success) {
      setSuccess(res.message);
      setCurrentStep("otp");
    } else {
      setError(res.message);
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
    const { name, email, password, otp } = formData;
    const res = await register(name, email, password, otp);
    setLoading(false);

    if (res.success) navigate("/login");
    else setError(res.message);
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

  const handleGoogleSuccess = async (res) => {
    const result = await googleAuth(res);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  const handleGoogleError = () =>
    setError("Google login failed. Please try again.");

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            {currentStep === "credentials"
              ? "Enter your details to get started"
              : "Verify your email to complete registration"}
          </p>
        </div>

        <StepProgress currentStep={currentStep} />

        <form className="space-y-6">
          {currentStep === "credentials" ? (
            <CredentialsForm formData={formData} handleChange={handleChange} />
          ) : (
            <OTPForm
              formData={formData}
              handleChange={handleChange}
              handleBackToCredentials={handleBackToCredentials}
              handleResendOTP={handleResendOTP}
              loading={loading}
            />
          )}

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

          <button
            onClick={
              currentStep === "credentials" ? handleSendOTP : handleFinalSubmit
            }
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? currentStep === "credentials"
                ? "Sending..."
                : "Creating Account..."
              : currentStep === "credentials"
              ? "Send Verification Code"
              : "Create Account"}
          </button>
        </form>

        {currentStep === "credentials" && (
          <>
            <SocialAuthButtons
              onGoogleSuccess={handleGoogleSuccess}
              onGoogleError={handleGoogleError}
              githubURL={`${URL}/auth/github`}
            />
          </>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
