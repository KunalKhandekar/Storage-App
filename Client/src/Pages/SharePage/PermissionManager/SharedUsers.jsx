import { Clock, Trash2, Users } from "lucide-react";
import {
  formatTime,
  PermissionBadge,
  UserAvatar,
} from "../../../Utils/helpers";

const SharedUsers = ({
  sharedUsers,
  handleUpdatePermission,
  loading,
  handleRevokeAccess,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users size={18} className="text-green-600" />
          </div>
          <h3 className="text-sm lg:text-base font-medium text-gray-900">
            Shared Users
          </h3>
          <span className="text-xs font-normal text-gray-500">
            ({sharedUsers.length})
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sharedUsers.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Users size={28} className="sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
              No users shared
            </h4>
            <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              This file hasn't been shared with any specific users yet.
            </p>
          </div>
        ) : (
          sharedUsers.map((share) => (
            <div
              key={share.userId._id}
              className="group bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
            >
              <div className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                      <UserAvatar user={share.userId} size="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight"
                        title={share.userId.name}
                      >
                        {share.userId.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                        <span>{share.userId.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          Shared {formatTime(share.sharedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <PermissionBadge permission={share.permission} />
                        <div className="flex items-center gap-2">
                          <select
                            value={share.permission}
                            onChange={(e) =>
                              handleUpdatePermission(
                                share.userId._id,
                                e.target.value
                              )
                            }
                            disabled={loading}
                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <option value="viewer">View Only</option>
                            <option value="editor">Can Edit</option>
                          </select>
                          <button
                            onClick={() => handleRevokeAccess(share.userId._id)}
                            disabled={loading}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Revoke access"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-200">
                      <UserAvatar user={share.userId} size="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4
                          className="text-sm lg:text-base font-medium text-gray-900 truncate"
                          title={share.userId.name}
                        >
                          {share.userId.name}
                        </h4>
                        <PermissionBadge permission={share.permission} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{share.userId.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Shared {formatTime(share.sharedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={share.permission}
                      onChange={(e) =>
                        handleUpdatePermission(share.userId._id, e.target.value)
                      }
                      disabled={loading}
                      className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[120px]"
                    >
                      <option value="viewer">View Only</option>
                      <option value="editor">Can Edit</option>
                    </select>
                    <button
                      onClick={() => handleRevokeAccess(share.userId._id)}
                      disabled={loading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Revoke access"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SharedUsers;
