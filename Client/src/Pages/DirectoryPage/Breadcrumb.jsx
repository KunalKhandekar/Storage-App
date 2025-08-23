import { ChevronDown, ChevronLeft, ChevronRight, Home } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDirectory from "../../hooks/useDirectory";

const Breadcrumb = ({ breadCrumb }) => {
  const { dirId } = useDirectory();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const currentItem = breadCrumb[breadCrumb.length - 1];
  const parentItem =
    breadCrumb.length > 1 ? breadCrumb[breadCrumb.length - 2] : null;
  const isAtRoot = breadCrumb.length <= 1;

  const handleBack = () => {
    if (parentItem) {
      navigate(`/directory/${parentItem._id}`);
    } else {
      navigate(`/`);
    }
  };

  const getDesktopItems = () => {
    return [breadCrumb[0], ...breadCrumb.slice(1)];
  };

  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
      {/* Mobile Layout - Current location with back button */}
      <div className="flex items-center justify-between w-full sm:hidden">
        <div className="flex items-center min-w-0 flex-1">
          {/* Back Button */}
          {!isAtRoot && (
            <button
              onClick={handleBack}
              className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors mr-2 flex-shrink-0"
              title="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Current Location */}
          <div className="flex items-center min-w-0 flex-1">
            {isAtRoot ? (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-2" />
                <span className="font-medium text-gray-900 truncate">
                  {currentItem?.name}
                </span>
              </div>
            ) : (
              <span className="font-medium text-gray-900 truncate">
                {currentItem?.name}
              </span>
            )}
          </div>
        </div>

        {/* Path Dropdown */}
        {breadCrumb.length > 1 && (
          <div className="relative ml-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
              title="Show full path"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20 min-w-[200px] max-w-[280px]">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    Full Path
                  </div>
                  {breadCrumb.map((item, index) => (
                    <button
                      key={item._id || index}
                      onClick={() => {
                        if (dirId !== item._id) {
                          navigate(
                            index === 0 ? `/` : `/directory/${item._id}`
                          );
                        }
                        setShowDropdown(false);
                      }}
                      disabled={dirId === item._id}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center ${
                        dirId === item._id
                          ? "text-gray-900 font-medium bg-gray-50"
                          : "text-gray-600"
                      }`}
                    >
                      {index === 0 && <Home className="w-3 h-3 mr-2" />}
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop Layout - Traditional breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 min-w-0 flex-1">
        <button
          onClick={() => navigate(`/`)}
          disabled={!dirId}
          className={`flex items-center p-1.5 rounded transition-colors flex-shrink-0 ${
            !dirId
              ? "text-gray-400 cursor-default"
              : "hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="ml-1.5 font-medium">{breadCrumb[0]?.name}</span>
        </button>

        {getDesktopItems()
          .slice(1)
          .map((item, index) => (
            <React.Fragment key={item._id || index}>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

              <button
                onClick={() =>
                  dirId !== item._id && navigate(`/directory/${item._id}`)
                }
                disabled={dirId === item._id}
                className={`px-2 py-1.5 rounded transition-colors min-w-0 max-w-[200px] ${
                  dirId === item._id
                    ? "text-gray-900 font-semibold cursor-default"
                    : "hover:text-blue-600 hover:bg-blue-50"
                }`}
                title={item.name}
              >
                <span className="font-medium truncate">{item.name}</span>
              </button>
            </React.Fragment>
          ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
