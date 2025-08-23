import { Download, Info, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatFileSize, getFileIcon } from "../../Utils/helpers";
import { deleteFile_or_Directory } from "../../Apis/file_Dir_Api";
import { useModal } from "../../Contexts/ModalContext";
import { DropdownMenu } from "./Dropdown";
import RenameModal from "./RenameModal";
import { useState } from "react";

const ItemCard = ({
  item,
  viewMode,
  activeDropdown,
  setActiveDropdown,
  setActionDone,
  setShowShareModal,
  setCurrentFile,
  onDetailsOpen,
}) => {
  const navigate = useNavigate();
  const { showConfirmModal, showModal, closeConfirmModal } = useModal();

  const [renameModalData, setRenameModalData] = useState({
    open: false,
    item: null,
  });

  // ---------------- HANDLERS ----------------
  const handleOpen = () => {
    if (item.type === "directory") {
      navigate(`/directory/${item._id}`);
    } else {
      window.open(`http://localhost:4000/file/${item._id}`, "_blank");
    }
  };

  const handleRename = () => {
    setRenameModalData({ open: true, item });
  };

  const handleDelete = async () => {
    showConfirmModal(
      "Delete " + item.type,
      `Are you sure you want to delete ${item.name}?`,
      async () => {
        try {
          const res = await deleteFile_or_Directory(item);
          if (res.success) {
            showModal("Success", `${item.type} has been deleted!`, "success");
            setActiveDropdown(null);
            setActionDone(true);
            closeConfirmModal();
          } else {
            showModal("Error", "Failed to delete " + item.type, "error");
          }
        } catch {
          showModal("Error", "Failed to delete " + item.type, "error");
        }
      },
      "warning"
    );
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    setActiveDropdown(null);

    switch (action) {
      case "details":
        onDetailsOpen(item);
        break;
      case "share":
        setShowShareModal(true);
        setCurrentFile(item);
        break;
      case "download":
        if (item.type === "file") {
          window.open(
            `http://localhost:4000/file/${item._id}?action=download`,
            "_blank"
          );
        }
        break;
      case "rename":
        handleRename();
        break;
      case "delete":
        handleDelete(e);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {viewMode === "list" ? (
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
                    <span className="font-medium">
                      {formatFileSize(item.size)}
                    </span>
                  </span>
                  <span className="hidden sm:flex items-center space-x-1">
                    <span>Modified:</span>
                    <span className="font-medium">
                      {formatDate(item.updatedAt)}
                    </span>
                  </span>
                  <span className="sm:hidden text-gray-400">
                    {formatDate(item.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {item.type === "file" && (
                <button
                  onClick={(e) => handleAction(e, "download")}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              )}
              <button
                onClick={(e) => handleAction(e, "details")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
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
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
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
      ) : (
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

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
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
      )}

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
};

export default ItemCard;
