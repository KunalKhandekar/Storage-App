import { Download, Info, MoreVertical } from "lucide-react";
import { formatDate, formatFileSize, getFileIcon } from "../../../Utils/helpers";
import { DropdownMenu } from "../Dropdown";

const GridView = ({item, handleOpen, handleAction, setActiveDropdown, activeDropdown, }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      <div className="p-3 sm:p-4 cursor-pointer" onClick={handleOpen}>
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-200">
            {getFileIcon(item)}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(
                  activeDropdown === item._id ? null : item._id
                );
              }}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {activeDropdown === item._id && (
              <DropdownMenu
                item={item}
                setActiveDropdown={setActiveDropdown}
                handleAction={handleAction}
              />
            )}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
              {item.name}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {item.type === "directory"
                ? "Folder"
                : item.name.split(".").pop()?.toUpperCase() || "File"}
            </span>
          </div>

          <div className="space-y-1 sm:space-y-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Size</span>
              <span className="font-medium text-gray-600">
                {formatFileSize(item.size)}
              </span>
            </div>
            <div className="hidden sm:flex items-center justify-between">
              <span className="text-gray-400">Modified</span>
              <span className="font-medium text-gray-600">
                {formatDate(item.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              onClick={(e) => handleAction(e, "details")}
              className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              title="View details"
            >
              <Info className="w-3 h-3" />
              <span className="text-xs">Details</span>
            </button>
            {item.type === "file" && (
              <button
                onClick={(e) => handleAction(e, "download")}
                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                title="Download file"
              >
                <Download className="w-3 h-3" />
                <span className="text-xs">Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridView;
