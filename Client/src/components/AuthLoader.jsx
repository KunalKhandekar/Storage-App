
const AuthLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Animated spinner */}
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          
          {/* Loading text */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Verifying Authentication
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we check your credentials...
          </p>
          
          {/* Optional animated dots */}
          <div className="flex justify-center mt-3 space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoader;