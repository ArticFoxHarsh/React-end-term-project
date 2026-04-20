/**
 * Profile.jsx
 * 
 * User profile page for managing account settings.
 * Features:
 * - Display user email
 * - Edit display name
 * - Edit personal goals
 * - Save changes to Firestore
 * - Account information
 * 
 * Route: /profile (protected)
 */

import React, { useState, useContext, useEffect } from 'react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Profile Component
 * 
 * Allows users to view and edit their profile information.
 * Syncs data with Firestore user document.
 */
const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [goals, setGoals] = useState('');

  /**
   * Load user profile data from Firestore on mount
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setDisplayName(data.displayName || user.displayName || '');
          setGoals(data.goals || '');
        } else {
          // Fallback to Firebase auth user data
          setDisplayName(user.displayName || '');
          setGoals('');
        }

        setError('');
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  /**
   * Handle form submission
   * Updates user profile in Firestore
   */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!user) {
      setError('User not authenticated');
      return;
    }

    // Validate inputs
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }

    setIsSaving(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        displayName: displayName.trim(),
        goals: goals.trim(),
      });

      setSuccessMessage('Profile updated successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);

      if (err.code === 'not-found') {
        // Create user document if it doesn't exist
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            displayName: displayName.trim(),
            email: user.email,
            goals: goals.trim(),
            createdAt: new Date(),
          });
          setSuccessMessage('Profile created successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (createErr) {
          console.error('Failed to create user document:', createErr);
          setError('Failed to save profile. Please try again.');
        }
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center text-2xl font-bold">
                {displayName
                  .split(' ')
                  .map((n) => n.charAt(0).toUpperCase())
                  .join('')
                  .slice(0, 2) || 'U'}
              </div>
              <div>
                <p className="text-sm text-purple-200">Account Email</p>
                <p className="text-xl font-semibold">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                ✓ {successMessage}
              </div>
            )}

            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError('');
                }}
                placeholder="Your name"
                disabled={isSaving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">This is how your name appears in the app</p>
            </div>

            {/* Goals Textarea */}
            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                Personal Goals (Optional)
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => {
                  setGoals(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Improve win rate to 70%, Master rebuttals, Participate in 12 debates this season"
                rows="4"
                disabled={isSaving}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add your personal goals to keep yourself motivated
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                '💾 Save Changes'
              )}
            </button>
          </form>
        </div>

        {/* Account Info Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <InfoRow label="Email Address" value={user?.email} />
            <InfoRow
              label="Account Created"
              value={
                user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'
              }
            />
            <InfoRow
              label="Last Sign In"
              value={
                user?.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'
              }
            />
            <InfoRow label="User ID" value={user?.uid} isCode />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Update your display name to personalize your account</li>
            <li>• Set personal goals to track what you want to achieve</li>
            <li>• Your email is used for login and cannot be changed here</li>
            <li>• All your data is securely stored and encrypted</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * InfoRow Component
 * Displays key-value pair in a row
 */
const InfoRow = ({ label, value, isCode = false }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-gray-200 last:border-b-0">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p
      className={`text-sm text-gray-900 mt-1 md:mt-0 ${
        isCode ? 'font-mono text-xs bg-gray-100 px-2 py-1 rounded' : 'font-medium'
      }`}
    >
      {value}
    </p>
  </div>
);

export default Profile;
