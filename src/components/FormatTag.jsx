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
          bg: 'bg-purple-100',
          text: 'text-purple-800',
        };
      case 'GD':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
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
    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles.bg} ${styles.text}`}>
      {format}
    </div>
  );
};

export default FormatTag;
