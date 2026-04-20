/**
 * Arguments.jsx
 * 
 * Arguments library page with search and filtering.
 * Features:
 * - Display all user arguments
 * - Search by claim or support points
 * - Filter by topic tag
 * - Create new arguments
 * - Delete arguments
 * - Show usage count in debates
 * 
 * Route: /arguments (protected, lazy-loaded)
 */

import React, { useState, useRef, useMemo } from 'react';
import useArguments from '../hooks/useArguments';
import ArgumentCard from '../components/ArgumentCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ArgumentForm from '../components/ArgumentForm';

/**
 * Arguments Component
 * 
 * Main page for browsing, searching, and managing argument library.
 * Uses useMemo to efficiently filter arguments without recomputing on every render.
 * Supports toggling between view and create modes.
 */
const Arguments = () => {
  const searchInputRef = useRef(null);
  const { arguments: allArguments, loading, error, addArgument, deleteArgument } = useArguments();

  // Page state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * Get unique topic tags from all arguments
   * Memoized to avoid recomputing on every render
   */
  const topicTags = useMemo(() => {
    const tags = new Set(allArguments.map((arg) => arg.topicTag));
    return Array.from(tags).sort();
  }, [allArguments]);

  /**
   * Filter arguments by search query and topic
   * Memoized to avoid recomputing on every render
   * 
   * Process:
   * 1. Filter by search query (claim or support contains search text)
   * 2. Filter by selected topic tag
   */
  const filteredArguments = useMemo(() => {
    let result = [...allArguments];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (arg) =>
          arg.claim.toLowerCase().includes(query) ||
          arg.support?.some((point) => point.toLowerCase().includes(query)) ||
          arg.topicTag.toLowerCase().includes(query)
      );
    }

    // Filter by selected topic
    if (selectedTopic) {
      result = result.filter((arg) => arg.topicTag === selectedTopic);
    }

    return result;
  }, [allArguments, searchQuery, selectedTopic]);

  /**
   * Handle add argument
   * Creates new argument and exits create mode
   */
  const handleAddArgument = async (argumentData) => {
    setIsSubmitting(true);
    try {
      await addArgument(argumentData);
      setIsCreateMode(false);
      setSearchQuery('');
      setSelectedTopic(null);
      setSubmitError('');
      // Focus search input after successful creation
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } catch (err) {
      console.error('Failed to add argument:', err);
      setSubmitError(err.message || 'Failed to create argument');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle delete argument
   * Confirms deletion before removing
   */
  const handleDeleteArgument = async (argumentId) => {
    if (window.confirm('Are you sure you want to delete this argument?')) {
      try {
        await deleteArgument(argumentId);
      } catch (err) {
        console.error('Failed to delete argument:', err);
        alert('Failed to delete argument. Please try again.');
      }
    }
  };

  /**
   * Handle cancel create mode
   */
  const handleCancelCreate = () => {
    setIsCreateMode(false);
    setSubmitError('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your argument library..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Argument Library</h1>
              <p className="text-gray-600 mt-2">
                {allArguments.length} argument{allArguments.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            {!isCreateMode && (
              <button
                onClick={() => setIsCreateMode(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 justify-center md:justify-start"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Argument
              </button>
            )}
          </div>
        </div>

        {/* Create Argument Form */}
        {isCreateMode && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Argument</h2>
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                {submitError}
              </div>
            )}
            <ArgumentForm
              onSubmit={handleAddArgument}
              onCancel={handleCancelCreate}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Search and Filter Section */}
        {allArguments.length > 0 && !isCreateMode && (
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <SearchBar
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search arguments by claim or keywords..."
            />

            {/* Topic Filter */}
            {topicTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Topic
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTopic === null
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Topics
                  </button>
                  {topicTags.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTopic === topic
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Summary */}
            {(searchQuery || selectedTopic) && (
              <div className="text-sm text-gray-600">
                Found <span className="font-medium text-gray-900">{filteredArguments.length}</span> argument
                {filteredArguments.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Arguments List or Empty State */}
        {filteredArguments.length > 0 ? (
          <div className="space-y-4">
            {filteredArguments.map((argument) => (
              <ArgumentCard
                key={argument.id}
                argument={argument}
                onDelete={handleDeleteArgument}
              />
            ))}
          </div>
        ) : allArguments.length === 0 ? (
          // No arguments at all
          <EmptyState
            message="No arguments saved yet. Start building your argument library!"
            ctaText="Create Your First Argument"
            onCtaClick={() => setIsCreateMode(true)}
          />
        ) : (
          // No results with active filters
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No arguments found</h3>
              <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-600 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Arguments;
