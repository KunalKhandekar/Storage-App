import ConfirmationModal from "../components/Modals/ConfrimationModal";
import Modal from "../components/Modals/Modal";
import { useModal } from "./ModalContext";

const Modals = () => {
  const { modal, confirmModal, closeModal, closeConfirmModal } = useModal();

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        {modal.message}
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

    </>
  );
};

export default Modals;
