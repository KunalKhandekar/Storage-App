import { Download, Edit2, Info, Share2, Trash2 } from "lucide-react";

export const DropdownMenu = ({ item, setActiveDropdown, handleAction, }) => {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdown(null);
        }}
      />
      <div className="absolute right-0 bottom-8 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 min-w-[180px]">
        <button
          onClick={(e) => handleAction(e, "details")}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Info className="w-4 h-4" />
          <span>Details</span>
        </button>
        {item.type === "file" && (
          <>
            <button
              onClick={(e) => handleAction(e, "download")}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={(e) => handleAction(e, "share")}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </>
        )}
        <button
          onClick={(e) => handleAction(e, "rename")}
          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Edit2 className="w-4 h-4" />
          <span>Rename</span>
        </button>
        <button
          onClick={(e) => handleAction(e, "delete")}
          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>

        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
      </div>
    </>
  );
};
