

import { useState } from "react"
import { getRoleChangePermissions } from "../../Utils/getUserPermissions"
import RoleBadge from "./RoleBadge"

const RoleChangeDropdown = ({ user, currentUser, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  const rolePermissions = getRoleChangePermissions()
  const canModifyRole = rolePermissions.canChangeRole(currentUser, user) && !user.isDeleted
  const availableRoles = rolePermissions.getAvailableRoles(currentUser, user)
  const tooltip = user.isDeleted
    ? "Cannot change role for deleted users"
    : rolePermissions.getRoleChangeTooltip(currentUser, user)

  const handleRoleChange = async (newRole) => {
    if (newRole === user.role) {
      setIsOpen(false)
      return
    }

    setIsChanging(true)
    try {
      await onRoleChange(user.id, newRole)
    } finally {
      setIsChanging(false)
      setIsOpen(false)
    }
  }

  if (!canModifyRole) {
    return (
      <div className="flex items-center group">
        <RoleBadge role={user.role} isDeleted={user.isDeleted} />
        <div className="ml-2 opacity-40 cursor-not-allowed" title={tooltip}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center group">
        <RoleBadge role={user.role} isDeleted={user.isDeleted} />
        <button
          onClick={() => setIsOpen(true)}
          disabled={isChanging}
          className="ml-2 inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md transition-all duration-200 disabled:opacity-50"
          title={tooltip}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900">Change Role</h3>
                <p className="text-sm text-gray-500 mt-1">{user.name || user.email}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isChanging}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Current:</span>
                <RoleBadge role={user.role} />
              </div>

              <div className="space-y-2">
                {availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      disabled={isChanging || role === user.role}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        role === user.role
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                      } disabled:opacity-50`}
                    >
                      <RoleBadge role={role} />
                      {role === user.role ? (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-8 h-8 mx-auto mb-2 text-gray-300"
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
                    <p className="text-sm">No roles available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Loading Overlay */}
            {isChanging && (
              <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Updating...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default RoleChangeDropdown
