import { AlertTriangle, CheckCircle, HardDrive } from "lucide-react";
import { useMemo } from "react";

const StorageUsage = ({ maxStorageLimit, usedStorageLimit }) => {
  
  const formatBytes = (bytes) => {
    if (bytes === 0 || isNaN(bytes) || bytes < 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const storageMetrics = useMemo(() => {
    const usedPercentage = (usedStorageLimit / maxStorageLimit) * 100;
    const remainingStorage = Math.max(0, maxStorageLimit - usedStorageLimit); // Prevent negative values
    const remainingPercentage = Math.max(0, 100 - usedPercentage); // Prevent negative percentages
    const isOverLimit = usedStorageLimit > maxStorageLimit;

    return {
      usedFormatted: formatBytes(usedStorageLimit),
      maxFormatted: formatBytes(maxStorageLimit),
      remainingFormatted: isOverLimit
        ? "0 Bytes"
        : formatBytes(remainingStorage),
      usedPercentage: Math.round(Math.min(usedPercentage, 100) * 100) / 100, // Cap at 100%
      remainingPercentage: Math.round(remainingPercentage * 100) / 100,
      isNearLimit: usedPercentage >= 80,
      isCritical: usedPercentage >= 95,
      isOverLimit,
    };
  }, [maxStorageLimit, usedStorageLimit]);

  const getStatusInfo = () => {
    if (storageMetrics.isOverLimit) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-100",
        barColor: "bg-red-600",
        icon: AlertTriangle,
        message: "Storage limit exceeded!",
      };
    } else if (storageMetrics.isCritical) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-100",
        barColor: "bg-red-500",
        icon: AlertTriangle,
        message: "Storage is critically full",
      };
    } else if (storageMetrics.isNearLimit) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        barColor: "bg-yellow-500",
        icon: AlertTriangle,
        message: "Storage is nearly full",
      };
    } else {
      return {
        color: "text-green-600",
        bgColor: "bg-green-100",
        barColor: "bg-blue-500",
        icon: CheckCircle,
        message: "Storage is healthy",
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <HardDrive className="mr-2" size={20} />
        Storage Usage
      </h2>

      {/* Storage Overview */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {storageMetrics.usedFormatted} of {storageMetrics.maxFormatted}{" "}
              used
            </h3>
            <p className={`text-sm flex items-center mt-1 ${statusInfo.color}`}>
              <statusInfo.icon size={14} className="mr-1" />
              {statusInfo.message}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} flex-shrink-0 w-fit sm:w-auto text-center`}
          >
            {storageMetrics.usedPercentage}% used
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${statusInfo.barColor}`}
            style={{
              width: `${Math.min(storageMetrics.usedPercentage, 100)}%`,
            }}
          ></div>
          {storageMetrics.isOverLimit && (
            <div className="w-full bg-red-600 rounded-full h-1 -mt-1 opacity-75"></div>
          )}
        </div>

        {/* Storage Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">Used Space</p>
            <p className="font-semibold text-gray-900">
              {storageMetrics.usedFormatted}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">Available Space</p>
            <p className="font-semibold text-gray-900">
              {storageMetrics.remainingFormatted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageUsage;
