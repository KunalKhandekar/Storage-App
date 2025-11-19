import { useEffect, useRef } from "react";

export default function OTPForm({
  formData,
  handleChange,
  handleBackToCredentials,
  handleResendOTP,
  loading,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    if (formData.email === "test@gmail.com") {
      inputRef.current.value = "9999";
    }
  }, []);
  return (
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
          Verification Code{" "}
          {formData.email === "test@gmail.com" && (
            <p className="text-yellow-600 text-bold text-center">
              (Click on Verify & Login - OTP is filled)
            </p>
          )}
        </label>
        <input
          ref={inputRef}
          id="otp"
          type="text"
          name="otp"
          placeholder="Enter 4-digit code"
          value={formData.otp}
          onChange={handleChange}
          maxLength="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={handleBackToCredentials}
          className="text-indigo-600 font-medium"
        >
          ← Back to Details
        </button>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={loading}
          className="text-indigo-600 font-medium"
        >
          Resend Code
        </button>
      </div>
    </>
  );
}
