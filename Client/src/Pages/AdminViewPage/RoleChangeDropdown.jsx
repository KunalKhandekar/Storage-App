import { useState } from "react";
import { getRoleChangePermissions } from "../../Utils/getUserPermissions";
import RoleBadge from "./RoleBadge";

const RoleChangeDropdown = ({ user, currentUser, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const rolePermissions = getRoleChangePermissions();
  const canModifyRole = rolePermissions.canChangeRole(currentUser, user);
  const availableRoles = rolePermissions.getAvailableRoles(currentUser, user);
  const tooltip = rolePermissions.getRoleChangeTooltip(currentUser, user);

  const handleRoleChange = async (newRole) => {
    if (newRole === user.role) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    try {
      await onRoleChange(user.id, newRole);
    } finally {
      setIsChanging(false);
      setIsOpen(false);
    }
  };

  if (!canModifyRole) {
    return (
      <div className="flex items-center group">
        <RoleBadge role={user.role} />
        <div className="ml-2 opacity-40 cursor-not-allowed" title={tooltip}>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center group">
        <RoleBadge role={user.role} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChanging}
          className="ml-2 inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={tooltip}
        >
          {isChanging ? (
            <svg
              className="w-4 h-4 animate-spin text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Change Role
                </h4>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  Current: {user.role}
                </div>
              </div>

              <div className="space-y-1">
                {availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      disabled={
                        isChanging || role === user.role || user.isDeleted
                      }
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        role === user.role
                          ? "bg-blue-50 text-blue-700 cursor-default"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      <RoleBadge role={role} />
                      {role === user.role && (
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-sm text-gray-500 text-center bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 mx-auto mb-1 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    No roles available
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleChangeDropdown;
