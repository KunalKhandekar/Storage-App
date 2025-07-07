// components/UserAvatar.js

const UserAvatar = ({ user, size = "default", isDeleted = false }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    default: "h-10 w-10",
    large: "h-12 w-12",
  };

  const textSizeClasses = {
    small: "text-xs",
    default: "text-sm",
    large: "text-base",
  };

  return (
    <div
      className={`${
        sizeClasses[size]
      } rounded-full flex items-center justify-center ${
        isDeleted ? "bg-red-100" : "bg-blue-100"
      }`}
    >
      <span
        className={`font-medium ${textSizeClasses[size]} ${
          isDeleted ? "text-red-600" : "text-blue-600"
        }`}
      >
        {user.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </span>
    </div>
  );
};

export default UserAvatar;
