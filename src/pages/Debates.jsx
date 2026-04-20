/**
 * Debates.jsx
 * 
 * All debates list page with filtering and searching.
 * Features:
 * - Display all user debates
 * - Search by topic (debounced)
 * - Filter by format and outcome
 * - Sort by date (newest first)
 * - CRUD operations (view, edit, delete)
 * 
 * Route: /debates (protected)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebates from '../hooks/useDebates';
import DebateCard from '../components/DebateCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

/**
 * Debates Component
 * 
 * Main page for viewing all debates with advanced filtering and search.
 * Uses useMemo to efficiently filter and sort debates without recomputing on every render.
 */
const Debates = () => {
  const navigate = useNavigate();
  const { debates, loading, deleteDebate } = useDebates();

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ format: null, outcome: null });

  /**
   * Handle filter change
   * Updates filters object
   */
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  /**
   * Filter and sort debates
   * Memoized to avoid recomputing on every render
   * 
   * Process:
   * 1. Filter by search query (topic contains search text)
   * 2. Filter by format (if selected)
   * 3. Filter by outcome (if selected)
   * 4. Sort by date (newest first)
   */
  const filteredDebates = useMemo(() => {
    let result = [...debates];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (debate) =>
          debate.topic.toLowerCase().includes(query) ||
          debate.notes?.toLowerCase().includes(query)
      );
    }

    // Filter by format
    if (filters.format) {
      result = result.filter((debate) => debate.format === filters.format);
    }

    // Filter by outcome
    if (filters.outcome) {
      result = result.filter((debate) => debate.outcome === filters.outcome);
    }

    // Sort by date (newest first - already sorted by useDebates, but ensure it)
    result.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : a.date?.toDate?.() || new Date(0);
      const dateB = b.date instanceof Date ? b.date : b.date?.toDate?.() || new Date(0);
      return dateB - dateA;
    });

    return result;
  }, [debates, searchQuery, filters]);

  /**
   * Handle delete debate
   * Confirms deletion before removing from Firestore
   */
  const handleDelete = async (debateId) => {
    if (window.confirm('Are you sure you want to delete this debate?')) {
      try {
        await deleteDebate(debateId);
      } catch (error) {
        console.error('Failed to delete debate:', error);
        alert('Failed to delete debate. Please try again.');
      }
    }
  };

  /**
   * Handle edit debate
   * Navigate to detail page
   */
  const handleEdit = (debateId) => {
    navigate(`/debates/${debateId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your debates..." />
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
              <h1 className="text-4xl font-bold text-gray-900 uppercase">All Debates</h1>
              <p className="text-gray-600 mt-2 font-medium">
                {debates.length} debate{debates.length !== 1 ? 's' : ''} logged
              </p>
            </div>
            <button
              onClick={() => navigate('/log')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 justify-center md:justify-start"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Log New Debate
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        {debates.length > 0 && (
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search debates by topic or notes..."
            />

            {/* Filter Bar */}
            <FilterBar filters={filters} onChange={handleFilterChange} />

            {/* Results Summary */}
            {(searchQuery || filters.format || filters.outcome) && (
              <div className="text-sm text-gray-600 font-medium">
                Found <span className="font-medium text-gray-900">{filteredDebates.length}</span> debate
                {filteredDebates.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}
          </div>
        )}

        {/* Debates List or Empty State */}
        {filteredDebates.length > 0 ? (
          <div className="space-y-4">
            {filteredDebates.map((debate) => (
              <DebateCard
                key={debate.id}
                debate={debate}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : debates.length === 0 ? (
          // No debates at all
          <EmptyState
            message="No debates logged yet. Start tracking your competitive speaking journey!"
            ctaText="Log Your First Debate"
            ctaLink="/log"
          />
        ) : (
          // No results with active filters
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="inline-block">
              <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4 mx-auto">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2 uppercase">No debates found</h3>
              <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ format: null, outcome: null });
                }}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 border border-purple-600 rounded-lg font-semibold transition-colors"
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

export default Debates;
