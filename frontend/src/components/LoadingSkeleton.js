import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200"></div>
        <div className="p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/8"></div>
              <div className="h-4 bg-gray-200 rounded w-1/8"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;