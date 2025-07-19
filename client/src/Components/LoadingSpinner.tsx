import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'gradient';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'gradient', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const getSpinnerColor = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-500';
      case 'purple':
        return 'border-purple-500';
      case 'gradient':
      default:
        return 'border-transparent';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Spinner */}
      <div className="relative">
        {color === 'gradient' ? (
          <div className={`${sizeClasses[size]} relative`}>
            {/* Gradient background ring */}
            <div className={`${sizeClasses[size]} absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-spin`}>
              <div className={`${sizeClasses[size]} absolute inset-1 bg-white rounded-full`}></div>
            </div>
            {/* Inner spinning dots */}
            <div className={`${sizeClasses[size]} absolute inset-0 rounded-full animate-pulse`}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className={`${sizeClasses[size]} border-2 ${getSpinnerColor()} border-t-transparent rounded-full animate-spin`}></div>
        )}
        
        {/* Pulsing center dot */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping`}></div>
      </div>

      {/* Loading text */}
      {text && (
        <div className="flex items-center space-x-1">
          <span className={`font-medium text-gray-600 ${textSizes[size]}`}>
            {text}
          </span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 