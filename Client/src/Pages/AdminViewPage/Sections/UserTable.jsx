import EmptyState from "../EmptyState";
import UserTableRow from "../UserTableRow";
import { useState, useMemo } from "react";

const UserTable = ({
  users,
  fetchUsers,
  handleLogout,
  openDeleteModal,
  handleRecover,
  currentUser,
  handleChangeRole
}) => {
  const [filter, setFilter] = useState("all");

  // Filter users based on selected filter
  const filteredUsers = useMemo(() => {
    switch (filter) {
      case "active":
        return users.filter((user) => !user.isDeleted);
      case "deleted":
        return users.filter((user) => user.isDeleted);
      case "admin":
        return users.filter(
          (user) => user.role === "Admin" || user.role === "SuperAdmin"
        );
      case "regular":
        return users.filter((user) => user.role === "User");
      case "online":
        return users.filter((user) => user.isLoggedIn && !user.isDeleted);
      default:
        return users;
    }
  }, [users, filter]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Users Management
            </h2>
            <p className="text-sm text-gray-600">
              Total users: {users.length} | Active:{" "}
              {users.filter((u) => !u.isDeleted).length} | Deleted:{" "}
              {users.filter((u) => u.isDeleted).length}
              {filter !== "all" && (
                <span className="ml-2 text-blue-600">
                  (Showing {filteredUsers.length} {filter} users)
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors appearance-none pr-8"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="online">Online Users</option>
                <option value="deleted">Deleted Users</option>
                <option value="admin">Admin Users</option>
                <option value="regular">Regular Users</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchUsers}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {filteredUsers.length === 0 ? (
        <EmptyState />
      ) : (
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
              {filteredUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  onRoleChange={handleChangeRole}
                  onLogout={handleLogout}
                  onDelete={openDeleteModal}
                  onRecover={handleRecover}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
