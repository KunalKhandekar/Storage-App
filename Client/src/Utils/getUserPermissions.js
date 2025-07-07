export const getUserPermissions = (currentUserRole) => {
  const roleHierarchy = {
    User: 1,
    Manager: 2,
    Admin: 3,
    SuperAdmin: 4,
  };

  const isLogoutDisabled = (user) => {
    if (!user.isLoggedIn) return true;

    const currentUserLevel = roleHierarchy[currentUserRole] || 0;
    const targetUserLevel = roleHierarchy[user.role] || 0;

    if (currentUserLevel <= targetUserLevel) return true;
    if (
      currentUserRole !== "Admin" &&
      currentUserRole !== "Manager" &&
      currentUserRole !== "SuperAdmin"
    )
      return true;

    return false;
  };

  const getLogoutTooltip = (user) => {
    if (!user.isLoggedIn) return "User is already logged out";

    const currentUserLevel = roleHierarchy[currentUserRole] || 0;
    const targetUserLevel = roleHierarchy[user.role] || 0;

    if (currentUserLevel <= targetUserLevel) {
      return `${currentUserRole}s cannot logout ${user.role} users (equal or higher role)`;
    }

    if (
      currentUserRole !== "Admin" &&
      currentUserRole !== "Manager" &&
      currentUserRole !== "SuperAdmin"
    )
      return "Insufficient permissions to logout users";

    return "Logout user";
  };

  const canDelete = (user) => {
    if (user.role === currentUserRole) return false;
    if (currentUserRole === "SuperAdmin" && user.role !== "SuperAdmin")
      return true;
    if (
      currentUserRole === "Admin" &&
      user.role !== "SuperAdmin" &&
      user.role !== "Admin"
    )
      return true;
    return false;
  };

  const canRecover = (user) => {
    return currentUserRole === "SuperAdmin" && user.isDeleted;
  };

  const getDeleteTooltip = (user) => {
    if (user.isDeleted) return "User is already deleted";
    if (user.role === currentUserRole)
      return `${currentUserRole}s cannot delete other ${currentUserRole}s`;
    if (currentUserRole === "SuperAdmin" && user.role !== "SuperAdmin")
      return "Delete user";
    if (currentUserRole === "Admin") {
      if (user.role === "SuperAdmin")
        return "Admins cannot delete SuperAdmin users";
      if (user.role === "Admin") return "Admins cannot delete other Admins";
      return "Soft delete user";
    }
    return "Insufficient permissions to delete users";
  };

  return {
    isLogoutDisabled,
    getLogoutTooltip,
    canDelete,
    canRecover,
    getDeleteTooltip,
  };
};

// Add this to your existing permissions utility file

export const getRoleChangePermissions = (currentUserRole) => {
  const roleHierarchy = {
    User: 1,
    Manager: 2,
    Admin: 3,
    SuperAdmin: 4,
  };

  const canChangeRole = (currentUser, targetUser) => {
    // Rule 1: Users cannot promote or demote themselves
    if (currentUser.id === targetUser.id) {
      return false;
    }

    const currentUserRoleLevel = roleHierarchy[currentUser.role] || 1;
    const targetUserRoleLevel = roleHierarchy[targetUser.role] || 1;

    // Rule 3: A user with a lower role cannot promote or demote a user with a higher role
    if (currentUserRoleLevel < targetUserRoleLevel) {
      return false;
    }

    // Rule 4: A user cannot change the role of another user who has the same role
    if (currentUserRoleLevel === targetUserRoleLevel) {
      return false;
    }

    return true;
  };

  const getAvailableRoles = (currentUser, targetUser) => {
    const allRoles = ["User", "Manager", "Admin", "SuperAdmin"];
    const currentUserRoleLevel = roleHierarchy[currentUser.role] || 1;

    return allRoles.filter((role) => {
      const roleLevel = roleHierarchy[role];

      // Rule 2: Only Super Admins can promote another user to Super Admin
      if (role === "SuperAdmin" && currentUser.role !== "SuperAdmin") {
        return false;
      }

      // Can only assign roles that are lower than or equal to current user's role
      // (excluding the case where it's the same as target user's current role)
      return roleLevel <= currentUserRoleLevel && role !== targetUser.role;
    });
  };

  const getRoleChangeTooltip = (currentUser, targetUser) => {
    if (currentUser.id === targetUser.id) {
      return "You cannot change your own role";
    }

    const currentUserRoleLevel = roleHierarchy[currentUser.role] || 1;
    const targetUserRoleLevel = roleHierarchy[targetUser.role] || 1;

    if (currentUserRoleLevel < targetUserRoleLevel) {
      return `${currentUser.role}s cannot change roles of ${targetUser.role}s (higher role)`;
    }

    if (currentUserRoleLevel === targetUserRoleLevel) {
      return `${currentUser.role}s cannot change roles of other ${targetUser.role}s (same role)`;
    }

    return "Change user role";
  };

  return {
    canChangeRole,
    getAvailableRoles,
    getRoleChangeTooltip,
  };
};
