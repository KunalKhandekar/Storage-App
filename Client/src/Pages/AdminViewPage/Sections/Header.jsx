import { useNavigate } from "react-router-dom";
import UserProfile from "../UserProfile";

const Header = ({ currentUser, goTo, backTo }) => {
  const navigate = useNavigate();
  console.log(currentUser);
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <button
          onClick={() => navigate(goTo)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-fit"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to {backTo}
        </button>
        <UserProfile user={currentUser} />
      </div>
    </div>
  );
};

export default Header;
