/**
 * FilterBar.jsx
 * 
 * Reusable filter component with dropdowns for format and outcome.
 * Used on the Debates page to filter debate list.
 * 
 * Props:
 *   filters: object - { format: string|null, outcome: string|null }
 *   onChange: function - Callback when filters change
 */

import React from 'react';

/**
 * FilterBar Component
 * 
 * Renders two dropdown filters for debate format and outcome.
 * Supports clearing individual filters via "All" option.
 * 
 * Props:
 *   filters: { format: string|null, outcome: string|null }
 *   onChange: (filterName, value) => void - Called with filter name and new value
 * 
 * Example:
 *   const [filters, setFilters] = useState({ format: null, outcome: null });
 *   const handleFilterChange = (name, value) => {
 *     setFilters(prev => ({ ...prev, [name]: value }));
 *   };
 *   <FilterBar filters={filters} onChange={handleFilterChange} />
 */
const FilterBar = ({ filters, onChange }) => {
  const formats = ['TurnCoat', 'MUN', 'GD', 'Parliamentary'];
  const outcomes = ['Win', 'Loss', 'Draw'];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Format Filter */}
      <div className="flex-1">
        <label htmlFor="format-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Format
        </label>
        <select
          id="format-filter"
          value={filters.format || ''}
          onChange={(e) => onChange('format', e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white"
        >
          <option value="">All Formats</option>
          {formats.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </select>
      </div>

      {/* Outcome Filter */}
      <div className="flex-1">
        <label htmlFor="outcome-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Outcome
        </label>
        <select
          id="outcome-filter"
          value={filters.outcome || ''}
          onChange={(e) => onChange('outcome', e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white"
        >
          <option value="">All Outcomes</option>
          {outcomes.map((outcome) => (
            <option key={outcome} value={outcome}>
              {outcome}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {(filters.format || filters.outcome) && (
        <div className="flex items-end">
          <button
            onClick={() => {
              onChange('format', null);
              onChange('outcome', null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
