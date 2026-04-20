/**
 * OutcomeBadge.jsx
 * 
 * Reusable badge component displaying debate outcome.
 * Shows Win (green), Loss (red), or Draw (gray) with appropriate styling.
 * 
 * Props:
 *   outcome: string - "Win" | "Loss" | "Draw"
 */

import React from 'react';

/**
 * OutcomeBadge Component
 * 
 * Renders a colored pill badge indicating the outcome of a debate.
 * Uses Tailwind colors for visual consistency.
 * 
 * Props:
 *   outcome: "Win" | "Loss" | "Draw" - The outcome to display
 * 
 * Example:
 *   <OutcomeBadge outcome="Win" />
 *   <OutcomeBadge outcome="Loss" />
 *   <OutcomeBadge outcome="Draw" />
 */
const OutcomeBadge = ({ outcome }) => {
  // Define styling based on outcome
  const getStyles = () => {
    switch (outcome) {
      case 'Win':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          dot: 'bg-green-500',
        };
      case 'Loss':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          dot: 'bg-red-500',
        };
      case 'Draw':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          dot: 'bg-gray-500',
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          dot: 'bg-gray-500',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 shadow-sm text-sm font-semibold uppercase tracking-wide ${styles.bg} ${styles.text}`}>
      <div className={`w-2 h-2 rounded-full ${styles.dot}`}></div>
      {outcome}
    </div>
  );
};

export default OutcomeBadge;
