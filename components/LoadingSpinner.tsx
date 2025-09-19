import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Processing...', progress = 0 }) => (
  <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
    {progress > 0 ? (
      <div className="w-full max-w-xs text-center">
        <p className="mb-2 text-lg font-semibold text-white">{text}</p>
        <div className="w-full bg-gray-600 rounded-full h-2.5">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-150 ease-linear" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
         <p className="mt-2 text-sm font-medium text-gray-300">{Math.round(Math.min(progress, 100))}% Complete</p>
      </div>
    ) : (
      <>
        <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-white">{text}</p>
      </>
    )}
  </div>
);

export default LoadingSpinner;