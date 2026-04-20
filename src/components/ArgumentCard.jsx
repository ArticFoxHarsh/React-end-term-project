/**
 * ArgumentCard.jsx
 * 
 * Reusable card component displaying a single argument entry.
 * Shows claim, supporting points, topic tag, usage count, and delete button.
 * 
 * Props:
 *   argument: object - Argument data object
 *   onDelete: function - Callback for delete action
 */

import React, { useState } from 'react';

/**
 * ArgumentCard Component
 * 
 * Displays an argument entry with claim, supporting evidence, topic tag, and usage count.
 * Includes expandable/collapsible support points section.
 * 
 * Props:
 *   argument: {
 *     id: string,
 *     claim: string,
 *     support: Array<string>,
 *     topicTag: string,
 *     usedInDebates: number
 *   }
 *   onDelete: (argumentId) => void - Called when delete button is clicked
 * 
 * Example:
 *   const argument = {
 *     id: '456',
 *     claim: 'Climate change requires immediate action',
 *     support: [
 *       'Scientific consensus: 97% of scientists agree',
 *       'Observable temperature rise over past 50 years',
 *       'Extreme weather events increasing'
 *     ],
 *     topicTag: 'Climate Policy',
 *     usedInDebates: 3
 *   };
 *   <ArgumentCard argument={argument} onDelete={handleDelete} />
 */
const ArgumentCard = ({ argument, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-6">
      {/* Header: Claim and Topic Tag */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{argument.claim}</h3>
        </div>
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full whitespace-nowrap">
          {argument.topicTag}
        </div>
      </div>

      {/* Usage Count and Support Points Count */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 text-sm text-gray-600">
        <span>
          Used in <span className="font-medium text-gray-900">{argument.usedInDebates}</span> debate
          {argument.usedInDebates !== 1 ? 's' : ''}
        </span>
        <span>
          <span className="font-medium text-gray-900">{argument.support.length}</span> point
          {argument.support.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Support Points */}
      {argument.support && argument.support.length > 0 && (
        <div className="mb-4">
          {/* Summary (always visible) */}
          <div className="text-sm">
            <p className="text-gray-600 font-medium mb-2">Key Points:</p>
            <p className="text-gray-700">{argument.support[0]}</p>
            {argument.support.length > 1 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2"
              >
                {isExpanded ? '- Hide' : '+ Show'} {argument.support.length - 1} more
              </button>
            )}
          </div>

          {/* Expanded support points */}
          {isExpanded && argument.support.length > 1 && (
            <ul className="mt-3 space-y-2 ml-4">
              {argument.support.slice(1).map((point, index) => (
                <li key={index} className="text-sm text-gray-700 list-disc">
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onDelete(argument.id)}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ArgumentCard;
