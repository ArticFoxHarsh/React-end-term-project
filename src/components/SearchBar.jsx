/**
 * SearchBar.jsx
 * 
 * Reusable debounced search input component.
 * Prevents excessive onChange calls while user is typing.
 * 
 * Props:
 *   value: string - Current search value
 *   onChange: function - Callback with debounced search value
 *   placeholder: string (optional) - Input placeholder text
 *   autoFocus: boolean (optional) - Auto-focus the input on mount
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * SearchBar Component
 * 
 * Renders a search input with built-in debouncing.
 * Debouncing prevents firing onChange on every keystroke, improving performance.
 * Includes search icon and optional auto-focus.
 * 
 * Props:
 *   value: string - Current search value from parent
 *   onChange: (query: string) => void - Callback with debounced search value
 *   placeholder: string - Input placeholder (default: "Search...")
 *   autoFocus: boolean - Auto-focus input on mount (default: false)
 *   debounceDelay: number - Debounce delay in ms (default: 300)
 *   ref: ForwardedRef - Reference to input element (forwarded via React.forwardRef)
 * 
 * Example:
 *   const [search, setSearch] = useState('');
 *   const searchRef = useRef(null);
 *   <SearchBar 
 *     ref={searchRef}
 *     value={search} 
 *     onChange={setSearch}
 *     placeholder="Search debates..."
 *     autoFocus
 *   />
 */
const SearchBar = React.forwardRef(({
  value,
  onChange,
  placeholder = 'Search...',
  autoFocus = false,
  debounceDelay = 300,
}, ref) => {
  const inputRef = ref || useRef(null);
  const debounceTimerRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);

  /**
   * Auto-focus input on mount if requested
   */
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  /**
   * Sync parent value to local state
   */
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  /**
   * Handle input change with debouncing
   * Clears previous timeout and sets new one
   */
  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Clear existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced timeout
      debounceTimerRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceDelay);
    },
    [onChange, debounceDelay]
  );

  /**
   * Clear search
   */
  const handleClear = () => {
    setInputValue('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Search Icon */}
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
      />

      {/* Clear Button */}
      {inputValue && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
