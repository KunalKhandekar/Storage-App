import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "danger":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const { icon: Icon, color, buttonColor } = getIconAndColor();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Icon className={`${color} w-6 h-6`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-gray-600 mb-6">{message}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${buttonColor} ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
