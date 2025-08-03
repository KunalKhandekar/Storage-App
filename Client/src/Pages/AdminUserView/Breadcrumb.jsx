import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ 
  currentPath = [], 
  onBreadcrumbClick, 
  className = "",
  homeLabel = "Root",
  showHome = true 
}) => {
  return (
    <div className={`inline-flex items-center flex-wrap gap-1 text-xs bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm ${className}`}>
      {/* Root/Home */}
      {showHome && (
        <button
          onClick={() => onBreadcrumbClick(-1)}
          disabled={currentPath.length === 0}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors duration-150 border ${
            currentPath.length === 0
              ? "bg-blue-50 text-blue-600 border-blue-200 cursor-default font-medium"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{homeLabel}</span>
        </button>
      )}

      {/* Dynamic Path Items */}
      {currentPath.map((path, index) => {
        const isActive = index === currentPath.length - 1;
        return (
          <div key={path.id} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <button
              onClick={() => onBreadcrumbClick(index)}
              disabled={isActive}
              className={`px-2.5 py-1 rounded-full transition-colors duration-150 border ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-blue-200 cursor-default font-medium"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {path.name}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;