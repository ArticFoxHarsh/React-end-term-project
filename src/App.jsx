/**
 * App.jsx
 * 
 * Main application component that sets up:
 * - Authentication provider wrapping the entire app
 * - React Router with all routes and navigation
 * - Route protection for authenticated-only pages
 * - Lazy loading with Suspense for performance optimization
 * 
 * Component Structure:
 *   AuthProvider > BrowserRouter > Navbar + Routes
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Pages - Eagerly loaded
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LogDebate from './pages/LogDebate';
import Debates from './pages/Debates';
import DebateDetail from './pages/DebateDetail';
import Profile from './pages/Profile';

// Pages - Lazily loaded for code splitting (performance optimization)
const Insights = lazy(() => import('./pages/Insights'));

/**
 * LoadingFallback Component
 * Renders while lazy-loaded pages are being imported
 */
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

/**
 * AppRoutes Component
 * Defines all application routes with proper protection and lazy loading
 * Routes are organized by authentication requirement:
 * - Public: /login, /signup
 * - Protected: All other routes
 */
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/log" element={<LogDebate />} />
      <Route path="/debates" element={<Debates />} />
      <Route path="/debates/:id" element={<DebateDetail />} />
      <Route
        path="/insights"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Insights />
          </Suspense>
        }
      />
      <Route path="/profile" element={<Profile />} />
    </Route>

    {/* Default Route */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    {/* 404 Fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

/**
 * App Component
 * Root component that wraps entire application with providers and router
 * 
 * Provider Order (from outside to inside):
 * 1. AuthProvider - manages authentication state globally
 * 2. BrowserRouter - enables client-side routing
 * 3. Navbar - displayed on all pages except /login and /signup
 * 4. Routes - page components
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
