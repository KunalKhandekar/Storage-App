import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });

  const showModal = (title, message, type = "info") =>
    setModal({ isOpen: true, title, message, type });

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const showConfirmModal = (title, message, onConfirm, type = "warning") =>
    setConfirmModal({ isOpen: true, title, message, onConfirm, type });

  const closeConfirmModal = () =>
    setConfirmModal({ ...confirmModal, isOpen: false });

  return (
    <ModalContext.Provider
      value={{
        modal,
        confirmModal,
        showModal,
        closeModal,
        showConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
