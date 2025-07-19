import LoadingSpinner from '../Components/LoadingSpinner';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <LoadingSpinner size="xl" text="Loading your shopping experience..." />
        <div className="mt-6 space-y-2">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-pulse"></div>
          <p className="text-sm text-gray-500">Please wait while we prepare everything for you</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
