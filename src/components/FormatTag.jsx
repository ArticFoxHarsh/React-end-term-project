/**
 * FormatTag.jsx
 * 
 * Reusable tag component displaying debate format.
 * Shows TurnCoat, MUN, GD, or Parliamentary with colored styling.
 * 
 * Props:
 *   format: string - "TurnCoat" | "MUN" | "GD" | "Parliamentary"
 */

import React from 'react';

/**
 * FormatTag Component
 * 
 * Renders a colored pill badge indicating the debate format.
 * Each format has a unique color for easy visual distinction.
 * 
 * Props:
 *   format: "TurnCoat" | "MUN" | "GD" | "Parliamentary" - The format to display
 * 
 * Example:
 *   <FormatTag format="TurnCoat" />
 *   <FormatTag format="MUN" />
 *   <FormatTag format="GD" />
 *   <FormatTag format="Parliamentary" />
 */
const FormatTag = ({ format }) => {
  // Define styling based on format
  const getStyles = () => {
    switch (format) {
      case 'TurnCoat':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
        };
      case 'MUN':
        return {
          bg: 'bg-pink-100',
          text: 'text-pink-800',
        };
      case 'GD':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
        };
      case 'Parliamentary':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`inline-block px-3 py-1 rounded-lg border border-gray-200 shadow-sm text-xs sm:text-sm font-semibold uppercase tracking-wide ${styles.bg} ${styles.text}`}>
      {format}
    </div>
  );
};

export default FormatTag;
