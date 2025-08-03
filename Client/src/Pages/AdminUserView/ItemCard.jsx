import {
    Eye,
    File,
    Folder
} from "lucide-react";

export const ItemCard = ({ item, type, onClick, setPreviewFile }) => {
    const handleClick = () => {
      if (onClick) onClick(item);
    };

    const handlePreview = (e) => {
      e.stopPropagation();
      setPreviewFile(item);
    };

    return (
      <div
        onClick={type === "directory" ? handleClick : handlePreview}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 group"
      >
        <div className="flex items-center space-x-3">
          {type === "directory" ? (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <File className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            {type === "directory" && (
              <p className="text-xs text-gray-500 mt-1">
                {item.itemCount !== undefined
                  ? `${item.itemCount} items`
                  : "Directory"}
              </p>
            )}
          </div>
          {type === "file" && (
            <button
              onClick={handlePreview}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all"
              title="Preview"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    );
  };