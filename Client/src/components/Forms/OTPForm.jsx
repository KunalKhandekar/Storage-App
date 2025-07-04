export default function OTPForm({
  formData,
  handleChange,
  handleBackToCredentials,
  handleResendOTP,
  loading,
}) {
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <button
          onClick={handleBackToCredentials}
          className="text-indigo-600 font-medium"
        >
          ← Back to Details
        </button>
        <button
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
