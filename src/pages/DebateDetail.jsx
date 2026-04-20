/**
 * DebateDetail.jsx
 * 
 * Single debate view and edit page.
 * Features:
 * - Display debate details
 * - Edit debate using DebateForm
 * - Delete debate with confirmation
 * - Toggle between view and edit modes
 * 
 * Route: /debates/:id (protected)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDebates from '../hooks/useDebates';
import DebateForm from '../components/DebateForm';
import DebateCard from '../components/DebateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FormatTag from '../components/FormatTag';
import OutcomeBadge from '../components/OutcomeBadge';
import RatingStars from '../components/RatingStars';

/**
 * DebateDetail Component
 * 
 * Shows detailed view of a single debate with edit and delete capabilities.
 * Supports toggling between view mode and edit mode.
 */
const DebateDetail = () => {
  const navigate = useNavigate();
  const { id: debateId } = useParams();
  const { debates, loading: debatesLoading, updateDebate, deleteDebate } = useDebates();

  // Page state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  /**
   * Find the debate from debates array
   * Memoized to avoid searching on every render
   */
  const debate = useMemo(() => {
    return debates.find((d) => d.id === debateId);
  }, [debates, debateId]);

  /**
   * Handle update debate
   * Updates Firestore and exits edit mode
   */
  const handleUpdateDebate = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateDebate(debateId, formData);
      setIsEditMode(false);
      setError('');
    } catch (err) {
      console.error('Failed to update debate:', err);
      throw err; // Let form handle error display
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle delete debate
   * Confirms deletion and redirects to debates list
   */
  const handleDeleteDebate = async () => {
    if (window.confirm('Are you sure you want to delete this debate? This action cannot be undone.')) {
      try {
        await deleteDebate(debateId);
        navigate('/debates', { replace: true });
      } catch (err) {
        console.error('Failed to delete debate:', err);
        setError('Failed to delete debate. Please try again.');
      }
    }
  };

  /**
   * Handle cancel edit
   */
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setError('');
  };

  // Loading state
  if (debatesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading debate details..." />
      </div>
    );
  }

  // Not found state
  if (!debate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="inline-block w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">Debate Not Found</h1>
            <p className="text-gray-600 mb-6">The debate you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/debates')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Debates
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/debates')}
          className="mb-6 text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Debates
        </button>

        {/* View Mode */}
        {!isEditMode && (
          <>
            {/* Debate Card */}
            <div className="mb-6">
              <DebateCard
                debate={debate}
                onEdit={() => setIsEditMode(true)}
                onDelete={handleDeleteDebate}
              />
            </div>

            {/* Full Details Section */}
            {debate.notes && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">Full Notes</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{debate.notes}</p>
              </div>
            )}

            {debate.eventArgument && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase">Cool Argument From Event</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{debate.eventArgument}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase">Debate Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <InfoItem label="Format" value={<FormatTag format={debate.format} />} />
                <InfoItem label="Side" value={debate.side} />
                <InfoItem label="Outcome" value={<OutcomeBadge outcome={debate.outcome} />} />
                <InfoItem
                  label="Rating"
                  value={<RatingStars value={debate.rating} size="sm" />}
                />
                <InfoItem
                  label="Date"
                  value={
                    debate.date instanceof Date
                      ? debate.date.toLocaleDateString()
                      : debate.date?.toDate?.().toLocaleDateString?.()
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Edit Mode */}
        {isEditMode && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Edit Debate</h2>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
                {error}
              </div>
            )}
            <DebateForm
              initialData={debate}
              onSubmit={handleUpdateDebate}
              onCancel={handleCancelEdit}
              isLoading={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * InfoItem Component
 * Helper component for displaying key-value pairs in detail view
 */
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">{label}</p>
    <div className="flex items-center">
      {typeof value === 'string' ? (
        <p className="text-gray-900 font-semibold">{value}</p>
      ) : (
        value
      )}
    </div>
  </div>
);

export default DebateDetail;
