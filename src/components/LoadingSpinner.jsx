/**
 * LoadingSpinner.jsx
 * 
 * Reusable centered loading spinner component.
 * Displays an animated spinner while data is being loaded.
 * 
 * Props:
 *   text: string (optional) - Loading text to display below spinner
 *   size: string (optional) - "sm" | "md" | "lg" - Size of spinner (default: "md")
 */

import React from 'react';

/**
 * LoadingSpinner Component
 * 
 * Renders a centered animated spinner with optional loading text.
 * Used in async operations, page transitions, and data fetching.
 * 
 * Props:
 *   text: string - Optional loading text (e.g., "Loading debates...")
 *   size: "sm" | "md" | "lg" - Size of spinner (default: "md")
 * 
 * Example:
 *   <LoadingSpinner />
 *   <LoadingSpinner text="Loading your debates..." />
 *   <LoadingSpinner text="Uploading..." size="lg" />
 */
const LoadingSpinner = ({ text, size = 'md' }) => {
  // Get spinner size based on size prop
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      case 'md':
      default:
        return 'w-12 h-12';
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses} relative`}>
        {/* Background circle */}
        <svg
          className="w-full h-full text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        </svg>

        {/* Animated spinner */}
        <svg
          className={`${sizeClasses} text-purple-600 absolute top-0 left-0 animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* Optional loading text */}
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
