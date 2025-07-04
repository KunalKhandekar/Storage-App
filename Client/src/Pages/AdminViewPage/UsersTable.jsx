import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("User");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/user/all-users", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const resData = await response.json();

      if (resData.success) {
        setUsers(resData.data.Users);
        setRole(resData.data.currentUser.role);
        setCurrentUser(resData.data.currentUser);
        setError(null);
      } else {
        setError(resData.message);
        setUsers([]);
      }
    } catch (err) {
      setUsers([]);
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user/${userId}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isLoggedIn: false } : user
          )
        );
      }
    } catch (err) {
      alert("Failed to logout user");
      console.error("Error logging out user:", err);
    }
  };

  const handleSoftDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user/${userId}/delete/soft`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isDeleted: true } : user
          )
        );
      }
    } catch (err) {
      alert("Failed to soft delete user");
      console.error("Error soft deleting user:", err);
    }
  };

  const handleHardDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user/${userId}/delete/hard`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (err) {
      alert("Failed to hard delete user");
      console.error("Error hard deleting user:", err);
    }
  };

  const handleRecover = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/user/${userId}/recover`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isDeleted: false } : user
          )
        );
      }
    } catch (err) {
      alert("Failed to recover user");
      console.error("Error recovering user:", err);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleDeleteChoice = (deleteType) => {
    const userId = deleteModal.user.id;
    if (deleteType === "soft") {
      handleSoftDelete(userId);
    } else if (deleteType === "hard") {
      handleHardDelete(userId);
    }
    closeDeleteModal();
  };

  // Helper function to determine if logout should be disabled
  const isLogoutDisabled = (user) => {
    if (!user.isLoggedIn) return true;

    // Define role hierarchy (higher number = higher role)
    const roleHierarchy = {
      User: 1,
      Manager: 2,
      Admin: 3,
      SuperAdmin: 4,
    };

    const currentUserLevel = roleHierarchy[role] || 0;
    const targetUserLevel = roleHierarchy[user.role] || 0;

    // Lower roles cannot logout higher or equal roles
    if (currentUserLevel <= targetUserLevel) return true;

    // Only Admin, Manager, and SuperAdmin can logout others
    if (role !== "Admin" && role !== "Manager" && role !== "SuperAdmin")
      return true;

    return false;
  };

  // Helper function to get logout button tooltip
  const getLogoutTooltip = (user) => {
    if (!user.isLoggedIn) return "User is already logged out";

    const roleHierarchy = {
      User: 1,
      Manager: 2,
      Admin: 3,
      SuperAdmin: 4,
    };

    const currentUserLevel = roleHierarchy[role] || 0;
    const targetUserLevel = roleHierarchy[user.role] || 0;

    if (currentUserLevel <= targetUserLevel) {
      return `${role}s cannot logout ${user.role} users (equal or higher role)`;
    }

    if (role !== "Admin" && role !== "Manager" && role !== "SuperAdmin")
      return "Insufficient permissions to logout users";

    return "Logout user";
  };

  // Helper function to determine delete permissions - UPDATED
  const canDelete = (user) => {
    // Users of the same role cannot delete each other
    if (user.role === role) return false;

    if (role === "SuperAdmin" && user.role !== "SuperAdmin") return true;
    if (role === "Admin" && user.role !== "SuperAdmin" && user.role !== "Admin")
      return true;
    return false;
  };

  // Helper function to determine recovery permissions
  const canRecover = (user) => {
    return role === "SuperAdmin" && user.isDeleted;
  };

  // Helper function to get delete button tooltip - UPDATED
  const getDeleteTooltip = (user) => {
    if (user.isDeleted) return "User is already deleted";
    if (user.role === role) return `${role}s cannot delete other ${role}s`;
    if (role === "SuperAdmin" && user.role !== "SuperAdmin")
      return "Delete user";
    if (role === "Admin") {
      if (user.role === "SuperAdmin")
        return "Admins cannot delete SuperAdmin users";
      if (user.role === "Admin") return "Admins cannot delete other Admins";
      return "Soft delete user";
    }
    return "Insufficient permissions to delete users";
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-fit"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </button>

            {currentUser && (
              <div className="w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  {/* Mobile Layout */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {currentUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          currentUser.role === "SuperAdmin"
                            ? "bg-red-100 text-red-800"
                            : currentUser.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : currentUser.role === "Manager"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {currentUser.role || "User"}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:items-center sm:justify-end sm:space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Badge for Desktop */}
                  <div className="hidden sm:flex sm:justify-end">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        currentUser.role === "SuperAdmin"
                          ? "bg-red-100 text-red-800"
                          : currentUser.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : currentUser.role === "Manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {currentUser.role || "User"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Users Management
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Total Users: {users?.length || 0}
                </p>
              </div>
              <button
                onClick={fetchUsers}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-fit self-start sm:self-auto"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      user.isDeleted ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <div
                            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                              user.isDeleted ? "bg-red-100" : "bg-blue-100"
                            }`}
                          >
                            <span
                              className={`font-medium text-xs sm:text-sm ${
                                user.isDeleted
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div
                            className={`text-xs sm:text-sm font-medium ${
                              user.isDeleted
                                ? "text-red-900 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {user.name}
                          </div>
                          {/* Show email on mobile under name */}
                          <div
                            className={`text-xs text-gray-500 sm:hidden ${
                              user.isDeleted ? "line-through" : ""
                            }`}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div
                        className={`text-sm ${
                          user.isDeleted
                            ? "text-red-900 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {user.email}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "SuperAdmin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "Manager"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role || "User"}
                      </span>
                      {/* Show status on mobile under role */}
                      <div className="mt-1 flex flex-col space-y-1 md:hidden">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                            user.isLoggedIn
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isLoggedIn ? "Online" : "Offline"}
                        </span>
                        {user.isDeleted && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 w-fit">
                            Deleted
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isLoggedIn
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isLoggedIn ? "Logged In" : "Logged Out"}
                        </span>
                        {user.isDeleted && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Deleted
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {!user.isDeleted && (
                          <button
                            onClick={() => handleLogout(user.id)}
                            disabled={isLogoutDisabled(user)}
                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto ${
                              isLogoutDisabled(user)
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            }`}
                            title={getLogoutTooltip(user)}
                          >
                            Logout
                          </button>
                        )}

                        {canRecover(user) ? (
                          <button
                            onClick={() => handleRecover(user.id)}
                            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700 cursor-pointer w-full sm:w-auto"
                            title="Recover user"
                          >
                            Recover
                          </button>
                        ) : canDelete(user) && !user.isDeleted ? (
                          // Show modal for both SuperAdmin and Admin
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                            title={getDeleteTooltip(user)}
                          >
                            Delete
                          </button>
                        ) : (
                          !user.isDeleted && (
                            <button
                              disabled
                              className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-gray-300 text-gray-500 cursor-not-allowed w-full sm:w-auto"
                              title={getDeleteTooltip(user)}
                            >
                              Delete
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!users || users.length === 0) && !loading && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding some users to your system.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Delete Modal */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-0 max-w-lg w-full mx-4 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Delete User
                    </h3>
                    <p className="text-red-100 text-sm">
                      This action requires confirmation
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {deleteModal.user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {deleteModal.user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {deleteModal.user?.email}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        deleteModal.user?.role === "SuperAdmin"
                          ? "bg-red-100 text-red-800"
                          : deleteModal.user?.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : deleteModal.user?.role === "Manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {deleteModal.user?.role || "User"}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Please choose how you want to delete this user:
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {role === "SuperAdmin" && (
                  <>
                    <button
                      onClick={() => handleDeleteChoice("soft")}
                      className="w-full group bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4z"
                          />
                        </svg>
                        <span>Soft Delete</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        Hide user from system • Can be recovered later
                      </p>
                    </button>
                    <button
                      onClick={() => handleDeleteChoice("hard")}
                      className="w-full group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Hard Delete</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        Permanently remove user • Cannot be recovered
                      </p>
                    </button>
                  </>
                )}

                {role === "Admin" && (
                  <button
                    onClick={() => handleDeleteChoice("soft")}
                    className="w-full group bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4z"
                        />
                      </svg>
                      <span>Soft Delete User</span>
                    </div>
                    <p className="text-xs mt-1 opacity-90">
                      Hide user from system • Can be recovered by SuperAdmin
                    </p>
                  </button>
                )}
              </div>

              {/* Cancel Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeDeleteModal}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
