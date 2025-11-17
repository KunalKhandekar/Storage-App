import { Check, Copy, Globe, Link } from "lucide-react";
import { PermissionBadge } from "../../../Utils/helpers";

const LinkSharingCard = ({
  linkSharing,
  handleToggleLink,
  file,
  handleCopyLink,
  copySuccess,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Link size={18} className="text-blue-600" />
          </div>
          <h3 className="text-sm lg:text-base font-medium text-gray-900">
            Link Sharing
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Toggle Section */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Globe size={18} className="text-gray-400 flex-shrink-0" />
              <p className="font-medium text-gray-900 text-sm">
                Share with link
              </p>
            </div>
            <p className="text-xs text-gray-500 ml-6 sm:ml-6">
              {linkSharing.enabled
                ? "Anyone with the link can access this file"
                : "Link sharing is currently disabled"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex-shrink-0">
            <button
              onClick={handleToggleLink}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                linkSharing.enabled ? "bg-blue-600" : "bg-gray-200"
              }`}
              aria-label={`${
                linkSharing.enabled ? "Disable" : "Enable"
              } link sharing`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  linkSharing.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Link Section - Only show when enabled */}
        {linkSharing.enabled && (
          <div className="mt-6 space-y-4">
            {/* Link Input and Copy Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={
                  linkSharing.link ||
                  `${import.meta.env.BASE_URL}/guest/access/${file?._id}?token=${file?.sharedViaLink?.token}`
                }
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  copySuccess
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 active:bg-blue-200"
                }`}
              >
                {copySuccess ? (
                  <>
                    <Check size={16} />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="hidden sm:inline">Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Permission Badge */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-gray-600">Permission:</span>
              <PermissionBadge
                permission={linkSharing.permission || "View Only"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkSharingCard;
