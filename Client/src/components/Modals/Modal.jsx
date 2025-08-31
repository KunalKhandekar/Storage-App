import { AlertCircle, CheckCircle, X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, type = "info" }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return { icon: CheckCircle, color: "text-green-600" };
      case "error":
        return { icon: AlertCircle, color: "text-red-600" };
      case "warning":
        return { icon: AlertCircle, color: "text-yellow-600" };
      default:
        return { icon: AlertCircle, color: "text-blue-600" };
    }
  };

  const { icon: Icon, color } = getIconAndColor();

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`${color} w-6 h-6`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
