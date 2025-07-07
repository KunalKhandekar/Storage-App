
const RoleBadge = ({ role }) => {
  const getRoleStyles = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-red-100 text-red-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleStyles(role)}`}>
      {role || 'User'}
    </span>
  );
};

export default RoleBadge;