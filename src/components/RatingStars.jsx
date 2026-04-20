/**
 * RatingStars.jsx
 * 
 * Reusable star rating component displaying 1-5 star ratings.
 * Supports both read-only display and interactive selection modes.
 * 
 * Props:
 *   value: number - Current rating (1-5)
 *   onChange: function (optional) - Callback when rating changes. If not provided, component is read-only
 *   size: string (optional) - "sm" | "md" | "lg" - Size of stars (default: "md")
 */

import React, { useState } from 'react';

/**
 * RatingStars Component
 * 
 * Renders 5 stars with the specified rating highlighted.
 * If onChange is provided, stars are interactive and trigger onChange on click.
 * If onChange is not provided, the component is read-only.
 * 
 * Props:
 *   value: 1 | 2 | 3 | 4 | 5 - The rating to display
 *   onChange: (rating: number) => void - Optional callback for interactive mode
 *   size: "sm" | "md" | "lg" - Size of stars (default: "md")
 * 
 * Example (read-only):
 *   <RatingStars value={4} />
 * 
 * Example (interactive):
 *   const [rating, setRating] = useState(3);
 *   <RatingStars value={rating} onChange={setRating} />
 */
const RatingStars = ({ value, onChange, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !!onChange;

  // Get star size based on size prop
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      case 'md':
      default:
        return 'w-5 h-5';
    }
  };

  const sizeClasses = getSizeClasses();

  /**
   * Handle star click (only in interactive mode)
   */
  const handleStarClick = (rating) => {
    if (isInteractive && onChange) {
      onChange(rating);
    }
  };

  /**
   * Get the display rating (use hoverRating if hovering, otherwise use value)
   */
  const displayRating = isInteractive ? (hoverRating || value) : value;

  return (
    <div
      className={`flex gap-1 ${isInteractive ? 'cursor-pointer' : ''}`}
      onMouseLeave={() => isInteractive && setHoverRating(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => isInteractive && setHoverRating(star)}
          disabled={!isInteractive}
          className={`transition-colors ${isInteractive ? 'hover:scale-110 active:scale-95' : ''}`}
          aria-label={`${star} stars`}
        >
          <svg
            className={`${sizeClasses} ${
              star <= displayRating
                ? 'fill-orange-400 text-orange-400'
                : 'fill-gray-200 text-gray-200'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
