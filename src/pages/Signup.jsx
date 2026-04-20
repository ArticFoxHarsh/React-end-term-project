/**
 * Signup.jsx
 * 
 * Signup page for new users.
 * Features:
 * - Display name, email, and password inputs
 * - Firebase email/password account creation
 * - Firestore user document creation
 * - Form validation and error display
 * - Loading state during signup process
 * - Link to login page for existing users
 * - Redirect to dashboard on successful signup
 * 
 * Route: /signup (public)
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import AuthContext from '../context/AuthContext';

/**
 * Signup Component
 * 
 * Form-based signup with Firebase authentication and Firestore user document creation.
 * Redirects authenticated users to dashboard.
 */
const Signup = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Redirect to dashboard if already authenticated
   */
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  /**
   * Handle signup form submission
   * 
   * Process:
   * 1. Validate all inputs
   * 2. Create Firebase user with email/password
   * 3. Update user profile with display name
   * 4. Create user document in Firestore
   * 5. Handle success → redirect to dashboard
   * 6. Handle errors → display error message
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!displayName.trim()) {
        throw new Error('Display name is required');
      }
      if (displayName.trim().length < 2) {
        throw new Error('Display name must be at least 2 characters');
      }
      if (!email.trim()) {
        throw new Error('Email is required');
      }
      if (!password.trim()) {
        throw new Error('Password is required');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Update user profile with display name
      await updateProfile(newUser, {
        displayName: displayName.trim(),
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        displayName: displayName.trim(),
        email: newUser.email,
        goals: '',
        createdAt: serverTimestamp(),
      });

      // Success: AuthContext will update and trigger redirect
      setDisplayName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Handle Firebase and validation errors
      let errorMessage = err.message;

      // Translate Firebase error codes to user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password signup is not enabled. Please contact support.';
      }

      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-4 w-28 h-28 bg-purple-100 rounded-lg -rotate-6 border border-gray-200"></div>
        <div className="absolute bottom-12 left-6 w-24 h-24 bg-yellow-100 rounded-lg rotate-12 border border-gray-200"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="inline-block text-xs font-semibold uppercase tracking-widest bg-purple-100 text-purple-700 px-3 py-1 rounded-lg mb-4 border border-gray-200">
            New Speaker Setup
          </p>
          <div className="inline-block w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-900 text-lg font-bold">DV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DebateVault</h1>
          <p className="text-gray-600 mt-2">Create your competitive speaking workspace</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Display Name Input */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <button
          onClick={() => navigate('/login')}
          type="button"
          className="w-full mt-6 py-2 px-4 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-colors"
        >
          Sign In
        </button>

        {/* Info Text */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-xs text-blue-800 font-medium">
            By signing up, you agree to our terms. Your data is encrypted and protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
