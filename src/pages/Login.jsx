/**
 * Login.jsx
 * 
 * Login page for existing users.
 * Features:
 * - Email and password form inputs
 * - Firebase email/password authentication
 * - Form validation and error display
 * - Loading state during auth process
 * - Link to signup page for new users
 * - Redirect to dashboard on successful login
 * 
 * Route: /login (public)
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import AuthContext from '../context/AuthContext';

/**
 * Login Component
 * 
 * Form-based login with Firebase authentication.
 * Redirects authenticated users to dashboard.
 */
const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
   * Handle login form submission
   * 
   * Process:
   * 1. Validate inputs
   * 2. Call Firebase signInWithEmailAndPassword
   * 3. Handle success → redirect to dashboard
   * 4. Handle errors → display error message
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        throw new Error('Email is required');
      }
      if (!password.trim()) {
        throw new Error('Password is required');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Success: AuthContext will update and trigger redirect
      setEmail('');
      setPassword('');
    } catch (err) {
      // Handle Firebase errors
      let errorMessage = err.message;

      // Translate Firebase error codes to user-friendly messages
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Email not found. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }

      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-4 w-28 h-28 bg-purple-100 rounded-lg rotate-12 border border-gray-200"></div>
        <div className="absolute bottom-10 right-6 w-24 h-24 bg-green-100 rounded-lg -rotate-12 border border-gray-200"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="inline-block text-xs font-semibold uppercase tracking-widest bg-purple-100 text-purple-700 px-3 py-1 rounded-lg mb-4 border border-gray-200">
            Competitive Speaking Tracker
          </p>
          <div className="inline-block w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-900 text-lg font-bold">DV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DebateVault</h1>
          <p className="text-gray-600 mt-2">Step into your neon debate control room</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">New to DebateVault?</span>
          </div>
        </div>

        {/* Signup Link */}
        <button
          onClick={() => navigate('/signup')}
          type="button"
          className="w-full mt-6 py-2 px-4 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-colors"
        >
          Create Account
        </button>

        {/* Info Text */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-xs text-blue-800 font-medium">
            Secure Firebase auth is enabled. Your data is encrypted and protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
