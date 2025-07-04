import { BsGithub } from "react-icons/bs";

const ConnectedAccount = ({ connectedAccount }) => {

  const getSocialIcon = (provider) => {
    const iconClass = "w-6 h-6";
    if (provider === "google") {
      return (
        <svg viewBox="0 0 24 24" className={iconClass}>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    }

    if (provider === "github") {
      return <BsGithub className="text-black w-6 h-6" />;
    }

    return <div className="w-6 h-6 bg-gray-300 rounded" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Connected Account
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          {getSocialIcon(connectedAccount.provider)}
          <div>
            <p className="font-medium text-gray-900">
              {connectedAccount.provider === "google" ? "Google" : "GitHub"}
            </p>
            <p className="text-sm text-gray-600 break-all">
              {connectedAccount.email}
            </p>
          </div>
        </div>
        <div className="sm:flex items-center justify-center sm:justify-end hidden">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Connected
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3">
        Only one social account can be connected at a time. This account is used
        for authentication.
      </p>
    </div>
  );
};

export default ConnectedAccount;
