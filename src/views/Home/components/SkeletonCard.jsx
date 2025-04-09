const SkeletonCard = () => {
    return (
      <div className="mx-auto w-[296px] lg:w-[300px] rounded-lg shadow-sm overflow-hidden flex flex-col border-2 animate-pulse">
        <div className="bg-gray-300 h-40 relative" />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="h-6 bg-gray-300 rounded mb-4 w-3/4" />
          <div className="flex justify-between items-center">
            <div className="w-1/3 h-4 bg-gray-300 rounded" />
            <div className="w-16 h-6 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

export default SkeletonCard;