import { Clock } from "lucide-react";
import { formatFileSize, formatTime, getFileIcon } from "../../../Utils/helpers";

const FileInfo = ({ file }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            {getFileIcon(file)}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-medium text-gray-900 text-sm lg:text-base truncate"
              title={file.name}
            >
              {file.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="font-medium">{formatFileSize(file.size)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Modified {formatTime(file.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;
