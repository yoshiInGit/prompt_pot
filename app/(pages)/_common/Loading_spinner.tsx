import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default LoadingSpinner;
