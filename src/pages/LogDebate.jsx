/**
 * LogDebate.jsx
 * 
 * Page for logging a new debate.
 * Uses DebateForm component in create mode (initialData is null).
 * 
 * Route: /log (protected)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebates from '../hooks/useDebates';
import DebateForm from '../components/DebateForm';

/**
 * LogDebate Component
 * 
 * Form page for creating and logging a new debate entry.
 * On successful submit, redirects to dashboard.
 */
const LogDebate = () => {
  const navigate = useNavigate();
  const { addDebate } = useDebates();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   * Creates new debate and redirects to dashboard
   */
  const handleSubmit = async (debateData) => {
    setIsSubmitting(true);
    try {
      await addDebate(debateData);
      // Success: redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Failed to log debate:', error);
      throw error; // Let form handle error display
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel button
   */
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 uppercase">Log New Debate</h1>
          <p className="text-gray-600 mt-2 font-medium">Record your latest competitive speaking event</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
          <DebateForm
            initialData={null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            💡 Tip: Logging debates regularly helps you find your strongest formats and recurring weaknesses faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogDebate;
