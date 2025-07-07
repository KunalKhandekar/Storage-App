const StatusBadge = ({ isLoggedIn, isDeleted, isMobile = false }) => {
  return (
    <div
      className={`flex ${
        isMobile ? "flex-col space-y-1" : "flex-col space-y-1"
      }`}
    >
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isLoggedIn
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        } ${isMobile ? "w-fit" : ""}`}
      >
        {isLoggedIn
          ? isMobile
            ? "Online"
            : "Logged In"
          : isMobile
          ? "Offline"
          : "Logged Out"}
      </span>
      {isDeleted && (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 ${
            isMobile ? "w-fit" : ""
          }`}
        >
          Deleted
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
