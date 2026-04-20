/**
 * DebateForm.jsx
 * 
 * Reusable form component for creating and editing debates.
 * Supports two modes:
 * - Create mode: initialData is null, calls addDebate on submit
 * - Edit mode: initialData is provided, calls updateDebate on submit
 * - Speech-to-text in notes field
 * - Cool argument capture for the event
 * 
 * Props:
 *   initialData: object | null - Pre-fill form if editing, null for new debate
 *   onSubmit: function - Callback after successful submit
 *   onCancel: function - Callback if user cancels
 *   isLoading: boolean - Show loading state while submitting
 */

import React, { useState, useEffect, useRef } from 'react';
import RatingStars from './RatingStars';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

/**
 * DebateForm Component
 * 
 * Multi-field form for debate data with validation.
 * Dynamically renders based on whether initialData is provided (edit vs create mode).
 * 
 * Props:
 *   initialData: {
 *     id?: string,
 *     topic: string,
 *     format: string,
 *     side: string,
 *     outcome: string,
 *     rating: number,
 *     notes: string,
 *     eventArgument: string,
 *     date: Date | Timestamp
 *   } | null
 *   onSubmit: (formData) => Promise<void>
 *   onCancel: () => void
 *   isLoading: boolean
 * 
 * Example (create mode):
 *   <DebateForm 
 *     initialData={null}
 *     onSubmit={handleAddDebate}
 *     onCancel={() => navigate('/log')}
 *     isLoading={false}
 *   />
 * 
 * Example (edit mode):
 *   <DebateForm 
 *     initialData={debate}
 *     onSubmit={handleUpdateDebate}
 *     onCancel={() => navigate('/debates')}
 *     isLoading={false}
 *   />
 */
const DebateForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { isListening, transcript, interimTranscript, isSupported, startListening, stopListening } = useSpeechRecognition();
  const speechTargetRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    format: 'MUN',
    side: 'For',
    outcome: 'Win',
    rating: 3,
    notes: '',
    eventArgument: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [activeSpeechField, setActiveSpeechField] = useState(null);

  /**
   * Pre-fill form with initialData if in edit mode
   */
  useEffect(() => {
    if (initialData) {
      const debateDate = initialData.date instanceof Date
        ? initialData.date
        : initialData.date?.toDate?.() || new Date();

      setFormData({
        topic: initialData.topic || '',
        format: initialData.format || 'MUN',
        side: initialData.side || 'For',
        outcome: initialData.outcome || 'Win',
        rating: initialData.rating || 3,
        notes: initialData.notes || '',
        eventArgument: initialData.eventArgument || '',
        date: debateDate.toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  /**
   * Update active target field when transcript is finalized
   * Appends speech transcript to the field selected when recording started
   */
  useEffect(() => {
    if (transcript && !isListening && speechTargetRef.current) {
      const targetField = speechTargetRef.current;
      console.log(`📝 Adding transcript to ${targetField}:`, transcript);
      setFormData((prev) => ({
        ...prev,
        [targetField]: prev[targetField] ? prev[targetField] + ' ' + transcript : transcript,
      }));
      speechTargetRef.current = null;
    }
  }, [isListening, transcript]);

  useEffect(() => {
    if (!isListening && activeSpeechField) {
      setActiveSpeechField(null);
    }
  }, [isListening, activeSpeechField]);

  /**
   * Toggle speech recognition on/off for a specific form field
   */
  const handleToggleSpeech = (fieldName) => {
    if (isListening && activeSpeechField === fieldName) {
      stopListening();
      return;
    }

    // Keep one recording session at a time to avoid conflicts
    if (isListening && activeSpeechField !== fieldName) {
      return;
    }

    speechTargetRef.current = fieldName;
    setActiveSpeechField(fieldName);
    startListening();
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle rating change
   */
  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    if (errors.rating) {
      setErrors((prev) => ({
        ...prev,
        rating: '',
      }));
    }
  };

  /**
   * Validate form data
   * Returns true if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    } else if (formData.topic.trim().length < 3) {
      newErrors.topic = 'Topic must be at least 3 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
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
      // Convert date string to Date object
      const debateData = {
        ...formData,
        date: new Date(formData.date),
      };

      await onSubmit(debateData);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Failed to save debate. Please try again.');
    }
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Topic Input */}
      <div>
        <label htmlFor="topic" className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-1">
          Debate Topic *
        </label>
        <input
          id="topic"
          name="topic"
          type="text"
          value={formData.topic}
          onChange={handleChange}
          placeholder="e.g., Climate Change, Gun Control, Universal Healthcare"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.topic && <p className="text-red-600 text-sm mt-1">{errors.topic}</p>}
      </div>

      {/* Format Dropdown */}
      <div>
        <label htmlFor="format" className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-1">
          Format *
        </label>
        <select
          id="format"
          name="format"
          value={formData.format}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
        >
          <option value="TurnCoat">TurnCoat</option>
          <option value="MUN">MUN</option>
          <option value="GD">GD (Group Discussion)</option>
          <option value="Parliamentary">Parliamentary</option>
        </select>
      </div>

      {/* Side Dropdown */}
      <div>
        <label htmlFor="side" className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-1">
          Which Side Did You Take? *
        </label>
        <select
          id="side"
          name="side"
          value={formData.side}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
        >
          <option value="For">For</option>
          <option value="Against">Against</option>
          <option value="Neutral">Neutral</option>
        </select>
      </div>

      {/* Outcome Dropdown */}
      <div>
        <label htmlFor="outcome" className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-1">
          Outcome *
        </label>
        <select
          id="outcome"
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
        >
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Draw">Draw</option>
        </select>
      </div>

      {/* Date Input */}
      <div>
        <label htmlFor="date" className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-1">
          Date of Debate *
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Rating Input */}
      <div>
        <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
          How Would You Rate This Debate? *
        </label>
        <div className="flex items-center gap-3">
          <RatingStars
            value={formData.rating}
            onChange={handleRatingChange}
            size="lg"
          />
          <span className="text-sm text-gray-600 font-medium">({formData.rating}/5)</span>
        </div>
        {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating}</p>}
      </div>

      {/* Notes Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="notes" className="block text-sm font-semibold uppercase tracking-wide text-gray-700">
            Notes (Optional)
          </label>
          {isSupported && (
            <button
              type="button"
              onClick={() => handleToggleSpeech('notes')}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isListening && activeSpeechField === 'notes'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                className={`w-4 h-4 ${isListening && activeSpeechField === 'notes' ? 'animate-pulse' : ''}`}
                fill={isListening && activeSpeechField === 'notes' ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
                />
              </svg>
              {isListening && activeSpeechField === 'notes' ? 'Listening...' : '🎤 Speak'}
            </button>
          )}
        </div>
        
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes about this debate... e.g., strong opening, need to work on rebuttal"
          rows="4"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />

        {/* Interim transcript preview while speaking */}
        {isListening && activeSpeechField === 'notes' && interimTranscript && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 italic">
            🎤 You're saying: "{interimTranscript}"
          </div>
        )}

        {/* Help text */}
        {isSupported && !isListening && (
          <p className="text-xs text-gray-500 mt-2">💡 Click Speak to capture your notes with voice</p>
        )}
        {isSupported && isListening && activeSpeechField === 'notes' && (
          <p className="text-xs text-red-600 mt-2">🎤 Microphone is active - speak now to add your review</p>
        )}
        {!isSupported && (
          <p className="text-xs text-yellow-600 mt-2">⚠️ Speech recognition not supported in your browser. Please use Chrome, Edge, or Safari.</p>
        )}
      </div>

      {/* Cool Argument Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="eventArgument" className="block text-sm font-semibold uppercase tracking-wide text-gray-700">
            Cool Argument From The Event (Optional)
          </label>
          {isSupported && (
            <button
              type="button"
              onClick={() => handleToggleSpeech('eventArgument')}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isListening && activeSpeechField === 'eventArgument'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                className={`w-4 h-4 ${isListening && activeSpeechField === 'eventArgument' ? 'animate-pulse' : ''}`}
                fill={isListening && activeSpeechField === 'eventArgument' ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
                />
              </svg>
              {isListening && activeSpeechField === 'eventArgument' ? 'Listening...' : '🎤 Speak'}
            </button>
          )}
        </div>

        <textarea
          id="eventArgument"
          name="eventArgument"
          value={formData.eventArgument}
          onChange={handleChange}
          placeholder="Write the best argument you made or heard in this event..."
          rows="3"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />

        {isListening && activeSpeechField === 'eventArgument' && interimTranscript && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 italic">
            🎤 You're saying: "{interimTranscript}"
          </div>
        )}

        {isSupported && isListening && activeSpeechField === 'eventArgument' && (
          <p className="text-xs text-red-600 mt-2">🎤 Microphone is active - speak your cool argument now</p>
        )}
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
          className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            isEditMode ? 'Update Debate' : 'Log Debate'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DebateForm;
