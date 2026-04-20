/**
 * EmptyState.jsx
 * 
 * Reusable empty state component shown when lists are empty.
 * Displays a message and optional call-to-action button.
 * 
 * Props:
 *   message: string - Description of empty state
 *   ctaText: string (optional) - CTA button text
 *   ctaLink: string (optional) - Route to navigate to on CTA click
 *   onCtaClick: function (optional) - Custom callback for CTA button
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * EmptyState Component
 * 
 * Renders a centered empty state illustration with message and optional CTA.
 * Used when lists are empty, searches have no results, or no data is available.
 * 
 * Props:
 *   message: string - Empty state description
 *   ctaText: string - Text for action button (optional)
 *   ctaLink: string - Route to navigate to on click (optional)
 *   onCtaClick: function - Custom callback instead of navigation (optional)
 * 
 * Example (with navigation):
 *   <EmptyState 
 *     message="No debates yet. Start tracking your speaking journey!" 
 *     ctaText="Log First Debate"
 *     ctaLink="/log"
 *   />
 * 
 * Example (with custom callback):
 *   <EmptyState 
 *     message="No arguments saved" 
 *     ctaText="Create Argument"
 *     onCtaClick={handleOpenModal}
 *   />
 */
const EmptyState = ({ message, ctaText, ctaLink, onCtaClick }) => {
  const navigate = useNavigate();

  /**
   * Handle CTA button click
   * Navigate if ctaLink is provided, otherwise call onCtaClick if provided
   */
  const handleCtaClick = () => {
    if (ctaLink) {
      navigate(ctaLink);
    } else if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Empty state icon */}
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
      </div>

      {/* Message */}
      <p className="text-gray-600 text-center text-lg mb-6 max-w-sm font-medium">{message}</p>

      {/* CTA Button */}
      {ctaText && (ctaLink || onCtaClick) && (
        <button
          onClick={handleCtaClick}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
