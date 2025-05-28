import {
  Download,
  Edit2,
  Eye,
  File,
  Folder,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RenameModal from "./RenameModal";
import { useState } from "react";

function ItemCard({
  item,
  activeDropdown,
  setActiveDropdown,
  setCurrentPath,
  setActionDone,
}) {
  const navigate = useNavigate();
  const [renameModalData, setRenameModalData] = useState({
    open: false,
    item: null,
  });
  const URL = "http://localhost:4000";

  const openItem = () => {
    if (item.type === "directory") {
      setCurrentPath(item.name);
      navigate(`/directory/${item._id}`);
    } else {
      window.location.href = `${URL}/file/${item._id}`;
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await fetch(URL + `/${item.type}/${item._id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setActionDone(true);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    console.log("Rename clicked for", item._id);
    setRenameModalData({ open: true, item });
  };

  const handleDropdownOpen = (e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === item._id ? null : item._id);
  };

  return (
    <>
      <div
        onClick={openItem}
        className="bg-white cursor-pointer rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 relative group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 w-56">
            {item.type === "directory" ? (
              <Folder className="w-8 h-8 text-blue-500" />
            ) : (
              <File className="w-8 h-8 text-gray-500" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              {item.type === "file" && (
                <p className="text-xs text-gray-500">{item.size}</p>
              )}
            </div>
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleDropdownOpen}
              className="p-1 rounded-full hover:bg-gray-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {activeDropdown === item._id && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 min-w-32">
                {item.type === "file" && (
                  <a
                    href={`${URL}/file/${item._id}?action=download`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                )}
                <button
                  onClick={handleRename}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {renameModalData.open && (
        <RenameModal
          item={renameModalData.item}
          onClose={() => setRenameModalData({ open: false, item: null })}
          onRename={() => {
            setActionDone(true);
            setRenameModalData({ open: false, item: null });
            setActiveDropdown(null);
          }}
        />
      )}
    </>
  );
}

export default ItemCard;
