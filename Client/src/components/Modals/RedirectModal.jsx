import { ArrowUpRight, Loader2, ShieldCheck, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const RedirectModal = ({ isOpen, onClose, redirectUrl }) => {
  const [countdown, setCountdown] = useState(3);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      return;
    }

    if (countdown === 0) {
      window.location.href = redirectUrl;
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, redirectUrl]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const progress = ((3 - countdown) / 3) * 100;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 ${
        isExiting ? "opacity-0" : "animate-backdrop-enter"
      } transition-opacity duration-200`}
    >
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-sm max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl ${
          isExiting ? "scale-95 opacity-0" : "animate-modal-enter"
        } transition-all duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="redirect-title"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
          aria-label="Cancel redirect"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="h-1 bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-5 pt-6 sm:p-6 sm:pt-8">
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse-ring" />
              <div className="relative bg-blue-50 rounded-full p-2.5 sm:p-3">
                <div className="bg-blue-600 rounded-full p-2.5 sm:p-3">
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2 sm:space-y-3">
            <h3
              id="redirect-title"
              className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight"
            >
              Redirecting you now
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-[260px] mx-auto">
              You are being redirected to a{" "}
              <strong>secure payment gateway</strong> for subscription
            </p>

            <div className="py-3 sm:py-4">
              <div className="inline-flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 animate-spin" />
                <div
                  key={countdown}
                  className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums animate-countdown-pulse"
                >
                  {countdown}
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                seconds remaining
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-gray-500 bg-gray-50 py-1.5 px-2.5 sm:px-3 rounded-full w-fit mx-auto">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
              <span>Secure connection</span>
            </div>
          </div>

          <div className="mt-4 pt-3 sm:mt-5 sm:pt-4 border-t border-gray-100">
            <button
              onClick={handleClose}
              className="w-full py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel and stay on this page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectModal;
