import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteFile_or_Directory } from "../../Apis/file_Dir_Api";
import { useModal } from "../../Contexts/ModalContext";
import RenameModal from "./RenameModal";
import GridView from "./view/GridView";
import ListView from "./view/ListView";

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
      window.open(`${import.meta.env.VITE_BACKEND_URL}/file/${item._id}`, "_blank");
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
            `${import.meta.env.VITE_BACKEND_URL}/file/${item._id}?action=download`,
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
        <ListView
          activeDropdown={activeDropdown}
          handleAction={handleAction}
          handleOpen={handleOpen}
          item={item}
          setActiveDropdown={setActiveDropdown}
        />
      ) : (
        <GridView
          activeDropdown={activeDropdown}
          handleAction={handleAction}
          handleOpen={handleOpen}
          item={item}
          setActiveDropdown={setActiveDropdown}
        />
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
