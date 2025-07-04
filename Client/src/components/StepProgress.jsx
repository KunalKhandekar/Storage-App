export default function StepProgress({ currentStep }) {
  return (
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
  );
}
