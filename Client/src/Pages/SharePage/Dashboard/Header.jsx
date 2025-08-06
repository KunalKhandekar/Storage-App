import { TrendingUp } from "lucide-react";

const Header = () => {
  return (
    <div className="text-center sm:text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            File Sharing Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm">
            Manage your shared files and collaborations seamlessly
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp size={14} />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
