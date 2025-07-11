import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";

const ProgressModal = ({ closeModal, isCompleted, error }) => {
  const getStatusIcon = () => {
    if (isCompleted)
      return <CheckCircle className="w-10 h-10 text-emerald-500" />;
    if (error) return <AlertCircle className="w-10 h-10 text-red-500" />;
    return <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />;
  };

  const getTitle = () => {
    if (isCompleted) return "Import Complete!";
    if (error) return "Import Failed";
    return "Importing from Google Drive";
  };

  const getMessage = () => {
    if (isCompleted)
      return "Your files have been successfully imported and are ready to use.";
    if (error) return error;
    return "Please wait while we securely import your files. This process typically takes 2–3 minutes.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Enhanced backdrop with better blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-500 ease-out"
        onClick={!isCompleted && !error ? undefined : closeModal}
      />

      {/* Modern modal container */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 ease-out scale-100 animate-in zoom-in-95 fade-in">
        {/* Close button - only show for error state */}
        {error && (
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {/* Status icon with enhanced container */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          {/* Dynamic background based on state */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              isCompleted
                ? "bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-emerald-200/50"
                : error
                ? "bg-gradient-to-br from-red-100 to-red-200 shadow-red-200/50"
                : "bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-200/50"
            } shadow-lg`}
          />

          {/* Animated rings for processing state */}
          {!isCompleted && !error && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-30" />
              <div className="absolute inset-2 rounded-full border border-blue-400 animate-pulse opacity-40" />
            </>
          )}

          {/* Success celebration ring */}
          {isCompleted && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-60" />
          )}

          {/* Icon with smooth entrance */}
          <div className="relative z-10 transform transition-all duration-500 scale-100">
            {getStatusIcon()}
          </div>
        </div>

        {/* Title with modern typography */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3 tracking-tight">
          {getTitle()}
        </h2>

        {/* Message with better readability */}
        <p className="text-base text-center text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
          {getMessage()}
        </p>

        {/* Action area with enhanced buttons */}
        <div className="text-center">
          {isCompleted ? (
            <button
              onClick={closeModal}
              className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <span className="relative z-10">Done</span>
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ) : error ? (
            <button
              onClick={closeModal}
              className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all duration-200 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <span className="relative z-10">Try Again</span>
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Progress indicator */}
              <div className="w-full max-w-xs">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"
                    style={{
                      width: "60%",
                      animation: "progress 3s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>

              {/* Status text */}
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="font-medium">Processing files...</span>
              </div>
            </div>
          )}
        </div>

        {/* Subtle animated border for processing state */}
        {!isCompleted && !error && (
          <div className="absolute inset-0 rounded-2xl border border-blue-200/50 animate-pulse" />
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 20%;
          }
          50% {
            width: 80%;
          }
          100% {
            width: 60%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressModal;
