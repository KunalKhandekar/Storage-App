"use client";

import {
  Download,
  Edit2,
  File,
  FileText,
  Folder,
  ImageIcon,
  MoreVertical,
  Music,
  Share2,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteFile_or_Directory } from "../../Apis/file_Dir_Api";
import RenameModal from "./RenameModal";
import { useModal } from "../../Contexts/ModalContext";
import { formatFileSize } from "../../Utils/helpers";

function ItemCard({
  item,
  activeDropdown,
  setActiveDropdown,
  setCurrentPath,
  setActionDone,
  setShowShareModal,
  viewMode = "list",
  setCurrentFile,
}) {
  const navigate = useNavigate();
  const [renameModalData, setRenameModalData] = useState({
    open: false,
    item: null,
  });
  const { showConfirmModal, closeConfirmModal, showModal } = useModal();

  const URL = "http://localhost:4000";

  // Get appropriate icon based on file type
  const getFileIcon = () => {
    if (item.type === "directory") {
      return (
        <Folder
          className={`${
            viewMode === "grid" ? "w-6 h-6 sm:w-8 sm:h-8" : "w-5 h-5"
          } text-blue-500`}
        />
      );
    }

    const extension = item.name.split(".").pop()?.toLowerCase();
    const iconSize = viewMode === "grid" ? "w-6 h-6 sm:w-8 sm:h-8" : "w-5 h-5";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <ImageIcon className={`${iconSize} text-green-500`} />;
    }
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension)) {
      return <Video className={`${iconSize} text-purple-500`} />;
    }
    if (["mp3", "wav", "flac", "aac"].includes(extension)) {
      return <Music className={`${iconSize} text-pink-500`} />;
    }
    if (["txt", "doc", "docx", "pdf"].includes(extension)) {
      return <FileText className={`${iconSize} text-orange-500`} />;
    }

    return <File className={`${iconSize} text-gray-500`} />;
  };

  const openItem = () => {
    if (item.type === "directory") {
      setCurrentPath(item.name);
      navigate(`/directory/${item._id}`);
    } else {
      window.open(`${URL}/file/${item._id}`, "_blank");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    showConfirmModal(
      "Delete "+ item.type,
      `Are you sure you want to delete ${item.type} ?`,
      async () => {
        try {
          const res = await deleteFile_or_Directory(item);
          if (res.success) {
            showModal("Success", `${item.type} has been deleted !`, "success");
            setActionDone(true);
            setActiveDropdown(null);
            closeConfirmModal();
          } else {
            showModal("Error", "Failed to delete " + item.type, "error");
          }
        } catch (error) {
          showModal("Error", "Failed to delete " + item.type, "error");
        }
      },
      "warning"
    );
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setRenameModalData({ open: true, item });
    setActiveDropdown(null);
  };

  const handleDropdownOpen = (e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === item._id ? null : item._id);
  };

  const handleShare = (e, file) => {
    e.stopPropagation();
    setShowShareModal(true);
    setCurrentFile(file);
    setActiveDropdown(null);
  };

  return (
    <>
      <div
        onClick={openItem}
        className="group relative bg-white cursor-pointer rounded-lg border border-gray-200 p-3 hover:shadow-md hover:border-gray-300 transition-all duration-200"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0 p-1.5 rounded-md bg-gray-50 group-hover:bg-gray-100 transition-colors">
              {getFileIcon()}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                {item.name}
              </h3>
            </div>

            <div className="hidden sm:flex items-center space-x-4 text-xs text-gray-500">
              {item.size && (
                <span className="min-w-[60px]">
                  {formatFileSize(item.size)}
                </span>
              )}
            </div>
          </div>

          {/* Actions dropdown - same as grid view */}
          <div
            className="relative flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDropdownOpen}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {activeDropdown === item._id && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
                  onClick={() => setActiveDropdown(null)}
                />
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 min-w-[180px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  {/* Same dropdown content as grid view */}
                  {item.type === "file" && (
                    <>
                      <a
                        href={`${URL}/file/${item._id}?action=download`}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </a>
                      <button
                        onClick={(e) => handleShare(e, item)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </>
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

                  <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                </div>
              </>
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
