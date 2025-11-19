import { Menu, Share2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { useAuth } from "../Contexts/AuthContext";
import { useStorage } from "../Contexts/StorageContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setStorageData } = useStorage();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setStorageData({
      maxStorageLimit: user.maxStorageLimit,
      usedStorageLimit: user.usedStorageLimit,
      availableStorageLimit: user.availableStorageLimit,
    });
  }, []);

  useEffect(() => {
    const controlHeader = () => {
      // Only apply scroll behavior on mobile (below md breakpoint)
      if (window.innerWidth >= 768) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    window.addEventListener("resize", controlHeader);

    return () => {
      window.removeEventListener("scroll", controlHeader);
      window.removeEventListener("resize", controlHeader);
    };
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header className="px-3 sm:px-5 py-2.5 sm:py-3 max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between">
            {/* LEFT — Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center">
                <FaCloudUploadAlt className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-base sm:text-xl font-semibold text-gray-900 xs:hidden">
                StoreMyStuff
              </h1>
            </div>

            {/* DESKTOP — Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/plans")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <MdSubscriptions className="w-4 h-4" />
                <span>Subscription</span>
              </button>

              <button
                onClick={() => navigate("/share")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {user.role !== "User" && (
                <button
                  onClick={() => navigate("/users")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </button>
              )}

              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors ml-2"
              >
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-md">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
              </button>
            </div>

            {/* MOBILE — Menu Toggle & Avatar */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => navigate("/settings")}
                className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-md"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase()
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU - Absolute positioned */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg !z-[5000]">
              <nav className="px-3 py-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/plans");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <MdSubscriptions className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Subscription
                  </span>
                </button>

                <button
                  onClick={() => {
                    navigate("/share");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Share
                  </span>
                </button>

                {user.role !== "User" && (
                  <button
                    onClick={() => {
                      navigate("/users");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Users
                    </span>
                  </button>
                )}

                <div className="pt-2 border-t border-gray-200 mt-2">
                  <div className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Backdrop overlay when menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
