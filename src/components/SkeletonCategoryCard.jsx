const SkeletonCategoryCard = () => {
    return (
      <div className="relative h-64 w-[296px] flex-shrink-0 rounded-lg overflow-hidden shadow-sm animate-pulse bg-gray-200">
        <div className="h-full w-full bg-gray-300" />
        <div className="absolute bottom-3 left-2 z-30 w-20  h-8 bg-gray-400 rounded-full" />
      </div>
    );
  };

  export default SkeletonCategoryCard