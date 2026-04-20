/**
 * ProtectedRoute.jsx
 * 
 * Route wrapper component that ensures only authenticated users can access protected pages.
 * 
 * Behavior:
 * - If loading: Show spinner (auth state is being checked)
 * - If no user: Redirect to /login
 * - If authenticated: Render the route outlet
 * 
 * Used as a layout route in App.jsx wrapping all protected pages
 */

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute Component
 * 
 * This component acts as a layout route that checks authentication state
 * before rendering any child routes. It's used with React Router's outlet pattern.
 * 
 * Returns:
 * - LoadingSpinner: While auth state is being determined
 * - Navigate to /login: If user is not authenticated
 * - Outlet: If user is authenticated (renders matched route)
 * 
 * Example usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 */
const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Show spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected route if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
