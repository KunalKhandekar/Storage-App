import { useNavigate } from "react-router-dom";
import RoleBadge from "./RoleBadge";
import RoleChangeDropdown from "./RoleChangeDropdown";
import StatusBadge from "./StatusBadge";
import UserActions from "./UserActions";
import { formatFileSize, UserAvatar } from "../../Utils/helpers";
import { getUserPermissions } from "../../Utils/getUserPermissions";
import { FaEye } from "react-icons/fa";

const UserTableRow = ({
  user,
  currentUser,
  onLogout,
  onDelete,
  onRecover,
  onRoleChange,
}) => {
  const navigate = useNavigate();
  const { canViewDirectory } = getUserPermissions(currentUser.role);

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${
        user.isDeleted ? "bg-red-50" : ""
      }`}
    >
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <UserAvatar user={user} />
          </div>
          <div className="ml-2 sm:ml-4">
            <div
              className={`text-xs sm:text-sm font-medium ${
                user.isDeleted ? "text-red-900 line-through" : "text-gray-900"
              }`}
            >
              {user.name}
            </div>
            <div
              className={`text-xs text-gray-500 ${
                user.isDeleted ? "line-through" : ""
              }`}
            >
              {user.email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-3 sm:px-6 py-4 whitespace-nowrap sm:table-cell">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm font-medium ${
                user.isDeleted ? "text-red-600 line-through" : "text-gray-900"
              }`}
            >
              {formatFileSize(user.storage.usedStorage)}
            </span>
            <span className="text-xs text-gray-500">
              of {formatFileSize(user.storage.totalStorage)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                user.isDeleted
                  ? "bg-red-400"
                  : user.storage.usedStorage / user.storage.totalStorage > 0.9
                  ? "bg-red-500"
                  : user.storage.usedStorage / user.storage.totalStorage > 0.7
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(
                  (user.storage.usedStorage / user.storage.totalStorage) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          {/* Percentage indicator (optional) */}
          <span className="text-xs text-gray-500">
            {(
              (user.storage.usedStorage / user.storage.totalStorage) *
              100
            ).toFixed(0)}
            % used
          </span>
        </div>
      </td>

      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <RoleChangeDropdown
          user={user}
          currentUser={currentUser}
          onRoleChange={onRoleChange}
        />
        <div className="mt-1 md:hidden">
          <StatusBadge
            isLoggedIn={user.isLoggedIn}
            isDeleted={user.isDeleted}
            isMobile={true}
          />
        </div>
      </td>

      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <StatusBadge
          isLoggedIn={user.isLoggedIn}
          isDeleted={user.isDeleted}
          isMobile={false}
        />
      </td>

      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
        <UserActions
          user={user}
          currentUserRole={currentUser.role}
          onLogout={onLogout}
          onDelete={onDelete}
          onRecover={onRecover}
        />
        {canViewDirectory(user) && (
          <button
            onClick={() => navigate(`/users/${user._id}`)}
            className="flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition duration-150"
            title="View User"
            aria-label={`View details of ${user.name}`}
          >
            <FaEye className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
};

export default UserTableRow;
