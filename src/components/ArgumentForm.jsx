/**
 * ArgumentForm.jsx
 * 
 * Reusable form component for creating new arguments.
 * Supports dynamic addition/removal of support points.
 * 
 * Props:
 *   onSubmit: function - Callback after successful submit
 *   onCancel: function - Callback if user cancels
 *   isLoading: boolean - Show loading state while submitting
 */

import React, { useState } from 'react';

/**
 * ArgumentForm Component
 * 
 * Multi-field form for creating arguments with support points.
 * Allows dynamic addition and removal of support points.
 * 
 * Props:
 *   onSubmit: (formData) => Promise<void>
 *   onCancel: () => void
 *   isLoading: boolean
 * 
 * Form Data:
 * {
 *   claim: string,
 *   support: Array<string>,
 *   topicTag: string
 * }
 * 
 * Example:
 *   <ArgumentForm 
 *     onSubmit={handleCreateArgument}
 *     onCancel={() => setIsCreateMode(false)}
 *     isLoading={isSubmitting}
 *   />
 */
const ArgumentForm = ({ onSubmit, onCancel, isLoading }) => {
  // Form state
  const [claim, setClaim] = useState('');
  const [supportPoints, setSupportPoints] = useState(['', '']);
  const [topicTag, setTopicTag] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  /**
   * Handle support point change
   */
  const handleSupportChange = (index, value) => {
    const newSupport = [...supportPoints];
    newSupport[index] = value;
    setSupportPoints(newSupport);
    // Clear error for this field
    if (errors[`support_${index}`]) {
      setErrors((prev) => ({
        ...prev,
        [`support_${index}`]: '',
      }));
    }
  };

  /**
   * Add empty support point
   */
  const handleAddSupportPoint = () => {
    setSupportPoints([...supportPoints, '']);
  };

  /**
   * Remove support point
   */
  const handleRemoveSupportPoint = (index) => {
    const newSupport = supportPoints.filter((_, i) => i !== index);
    setSupportPoints(newSupport.length > 0 ? newSupport : ['']);
  };

  /**
   * Validate form data
   * Returns true if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!claim.trim()) {
      newErrors.claim = 'Claim is required';
    } else if (claim.trim().length < 5) {
      newErrors.claim = 'Claim must be at least 5 characters';
    }

    if (!topicTag.trim()) {
      newErrors.topicTag = 'Topic tag is required';
    }

    // Validate at least one support point
    const filledSupport = supportPoints.filter((s) => s.trim());
    if (filledSupport.length === 0) {
      newErrors.support = 'Add at least one support point';
    } else if (filledSupport.some((s) => s.trim().length < 3)) {
      newErrors.support = 'Each support point must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const argumentData = {
        claim: claim.trim(),
        support: supportPoints.filter((s) => s.trim()),
        topicTag: topicTag.trim(),
      };

      await onSubmit(argumentData);
      // Reset form on success
      setClaim('');
      setSupportPoints(['', '']);
      setTopicTag('');
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Failed to create argument. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Claim Input */}
      <div>
        <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-1">
          Main Argument Claim *
        </label>
        <input
          id="claim"
          type="text"
          value={claim}
          onChange={(e) => {
            setClaim(e.target.value);
            if (errors.claim) setErrors((prev) => ({ ...prev, claim: '' }));
          }}
          placeholder="e.g., Universal healthcare improves public health outcomes"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.claim && <p className="text-red-600 text-sm mt-1">{errors.claim}</p>}
      </div>

      {/* Topic Tag Input */}
      <div>
        <label htmlFor="topicTag" className="block text-sm font-medium text-gray-700 mb-1">
          Topic Tag *
        </label>
        <input
          id="topicTag"
          type="text"
          value={topicTag}
          onChange={(e) => {
            setTopicTag(e.target.value);
            if (errors.topicTag) setErrors((prev) => ({ ...prev, topicTag: '' }));
          }}
          placeholder="e.g., Healthcare, Climate Policy, Economics"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.topicTag && <p className="text-red-600 text-sm mt-1">{errors.topicTag}</p>}
      </div>

      {/* Support Points */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Supporting Evidence/Points *
          </label>
          <span className="text-xs text-gray-500">{supportPoints.filter((s) => s.trim()).length} points</span>
        </div>

        <div className="space-y-2">
          {supportPoints.map((point, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={point}
                onChange={(e) => handleSupportChange(index, e.target.value)}
                placeholder={`Support point ${index + 1}...`}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {supportPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSupportPoint(index)}
                  disabled={isLoading}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:cursor-not-allowed"
                  aria-label="Remove support point"
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
          ))}
        </div>

        {errors.support && <p className="text-red-600 text-sm mt-1">{errors.support}</p>}

        {/* Add Support Point Button */}
        <button
          type="button"
          onClick={handleAddSupportPoint}
          disabled={isLoading}
          className="mt-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 border border-purple-600 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
        >
          + Add Support Point
        </button>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {submitError}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </>
          ) : (
            'Create Argument'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ArgumentForm;
