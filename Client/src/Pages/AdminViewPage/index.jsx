import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import DeleteModal from "./DeleteModal";
import ErrorDisplay from "./ErrorDisplay";
import LoadingSpinner from "./LoadingSpinner";
import Header from "./Sections/Header";
import Statistics from "./Sections/Statistics";
import UserTable from "./Sections/UserTable";

const AdminView = () => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  const {
    users,
    role,
    currentUser,
    loading,
    error,
    fetchUsers,
    handleLogout,
    handleSoftDelete,
    handleHardDelete,
    handleRecover,
    handleChangeRole
  } = useUsers();

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleDeleteChoice = (deleteType, userId) => {
    if (deleteType === "soft") {
      handleSoftDelete(userId);
    } else if (deleteType === "hard") {
      handleHardDelete(userId);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchUsers} />;
  }

  return (
    <div className="bg-gray-50  py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Header currentUser={currentUser} goTo={"/"} backTo={"Home"}/>

        {/* Statistics Section */}
        <Statistics users={users} />

        {/* Users Table Section */}
        <UserTable
          users={users}
          fetchUsers={fetchUsers}
          currentUser={currentUser}
          handleLogout={handleLogout}
          handleRecover={handleRecover}
          openDeleteModal={openDeleteModal}
          handleChangeRole={handleChangeRole}
        />

        
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        user={deleteModal.user}
        role={role}
        onClose={closeDeleteModal}
        onDelete={handleDeleteChoice}
      />
    </div>
  );
};

export default AdminView;
