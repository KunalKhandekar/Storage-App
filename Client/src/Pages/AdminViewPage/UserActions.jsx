import { getUserPermissions } from "../../Utils/getUserPermissions";

const UserActions = ({
  user,
  currentUserRole,
  onLogout,
  onDelete,
  onRecover,
}) => {
  const {
    isLogoutDisabled,
    getLogoutTooltip,
    canDelete,
    canRecover,
    getDeleteTooltip,
  } = getUserPermissions(currentUserRole);

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      {!user.isDeleted && (
        <button
          onClick={() => onLogout(user.id)}
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
          onClick={() => onRecover(user.id)}
          className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700 cursor-pointer w-full sm:w-auto"
          title="Recover user"
        >
          Recover
        </button>
      ) : canDelete(user) && !user.isDeleted ? (
        <button
          onClick={() => onDelete(user)}
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
  );
};

export default UserActions;
