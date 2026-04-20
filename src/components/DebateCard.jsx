/**
 * DebateCard.jsx
 * 
 * Reusable card component displaying a single debate entry.
 * Shows topic, format, outcome, rating, date, and action buttons.
 * 
 * Props:
 *   debate: object - Debate data object
 *   onEdit: function - Callback for edit action
 *   onDelete: function - Callback for delete action
 */

import React from 'react';
import FormatTag from './FormatTag';
import OutcomeBadge from './OutcomeBadge';
import RatingStars from './RatingStars';

/**
 * DebateCard Component
 * 
 * Displays a debate entry with all relevant information in a card layout.
 * Includes action buttons for editing and deleting.
 * 
 * Props:
 *   debate: {
 *     id: string,
 *     topic: string,
 *     format: string,
 *     side: string,
 *     outcome: string,
 *     rating: number,
 *     date: Timestamp | Date,
 *     notes: string,
 *     eventArgument: string
 *   }
 *   onEdit: (debateId) => void - Called when edit button is clicked
 *   onDelete: (debateId) => void - Called when delete button is clicked
 * 
 * Example:
 *   const debate = {
 *     id: '123',
 *     topic: 'Climate Change',
 *     format: 'MUN',
 *     side: 'For',
 *     outcome: 'Win',
 *     rating: 5,
 *     date: new Date(),
 *     notes: 'Great opening argument'
 *   };
 *   <DebateCard 
 *     debate={debate} 
 *     onEdit={handleEdit} 
 *     onDelete={handleDelete} 
 *   />
 */
const DebateCard = ({ debate, onEdit, onDelete }) => {
  /**
   * Format date for display
   * Shows date in MM/DD/YYYY format
   */
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : date.toDate?.();
    if (!dateObj) return '';
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-5 sm:p-6">
      {/* Header: Topic and Format */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate uppercase tracking-wide">{debate.topic}</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Side: <span className="font-medium">{debate.side}</span>
          </p>
        </div>
        <FormatTag format={debate.format} />
      </div>

      {/* Details Row: Outcome, Rating, Date */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-200">
        {/* Outcome Badge */}
        <OutcomeBadge outcome={debate.outcome} />

        {/* Rating Stars */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rating:</span>
          <RatingStars value={debate.rating} size="sm" />
        </div>

        {/* Date */}
        <div className="text-sm text-gray-600 sm:ml-auto font-medium">
          {formatDate(debate.date)}
        </div>
      </div>

      {/* Notes (if present) */}
      {debate.notes && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Notes: </span>
            {debate.notes}
          </p>
        </div>
      )}

      {/* Cool Argument (if present) */}
      {debate.eventArgument && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Cool Argument: </span>
            {debate.eventArgument}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end flex-wrap">
        <button
          onClick={() => onEdit(debate.id)}
          className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(debate.id)}
          className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DebateCard;
