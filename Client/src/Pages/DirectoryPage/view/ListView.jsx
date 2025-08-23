import { Download, Info, MoreVertical } from "lucide-react";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
} from "../../../Utils/helpers";
import { DropdownMenu } from "../Dropdown";

const ListView = ({
  item,
  handleOpen,
  handleAction,
  setActiveDropdown,
  activeDropdown,
}) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div
          className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 cursor-pointer"
          onClick={handleOpen}
        >
          <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
            {getFileIcon(item)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item.type === "directory"
                  ? "Folder"
                  : item.name.split(".").pop()?.toUpperCase() || "File"}
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <span className="hidden sm:inline">Size:</span>
                <span className="font-medium">{formatFileSize(item.size)}</span>
              </span>
              <span className="hidden sm:flex items-center space-x-1">
                <span>Modified:</span>
                <span className="font-medium">
                  {formatDate(item.updatedAt)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {item.type === "file" && (
            <button
              onClick={(e) => handleAction(e, "download")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100 hidden sm:flex"
              title="Download"
            >
              <Download className="w-4 h-4 text-gray-500" />
            </button>
          )}

          <button
            onClick={(e) => handleAction(e, "details")}
            className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
            title="Details"
          >
            <Info className="w-4 h-4 text-gray-500" />
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(
                  activeDropdown === item._id ? null : item._id
                );
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
      </div>
    </div>
  );
};

export default ListView;
