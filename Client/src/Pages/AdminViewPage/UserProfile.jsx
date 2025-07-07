import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="w-full sm:w-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center space-x-3">
            <UserAvatar user={user} />
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                {user?.email}
              </p>
            </div>
          </div>
          <RoleBadge role={user?.role} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-end sm:space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <UserAvatar user={user} />
        </div>

        {/* Role Badge for Desktop */}
        <div className="hidden sm:flex sm:justify-end">
          <RoleBadge role={user?.role} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
