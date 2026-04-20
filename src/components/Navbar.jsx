/**
 * Navbar.jsx
 * 
 * Top navigation component displaying:
 * - Logo/brand name on the left
 * - Navigation links (dashboard, debates, arguments, insights, profile)
 * - User avatar and logout button on the right
 * 
 * Behavior:
 * - Hidden on /login and /signup pages
 * - Only visible when user is authenticated
 * - Mobile responsive with Tailwind
 * - Uses purple (#534AB7) accent color for active states
 */

import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * Navbar Component
 * 
 * Renders the top navigation bar with logo, links, and user menu.
 * Hides itself on login/signup pages by checking the current route.
 * 
 * Navigation Links:
 * - Dashboard: /dashboard
 * - Debates: /debates
 * - Arguments: /arguments
 * - Insights: /insights
 * - Profile: /profile
 */
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage || !user) {
    return null;
  }

  /**
   * Handle logout click
   * Signs out user and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Check if a link is active
   * Used to highlight the current page in navigation
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Get user initials for avatar
   * e.g., "John Doe" -> "JD"
   */
  const getInitials = (displayName) => {
    if (!displayName) return 'U';
    return displayName
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-bold text-2xl text-gray-900 hover:text-purple-600 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span>DebateVault</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" isActive={isActive('/dashboard')} label="Dashboard" />
            <NavLink to="/debates" isActive={isActive('/debates')} label="Debates" />
            <NavLink to="/arguments" isActive={isActive('/arguments')} label="Arguments" />
            <NavLink to="/insights" isActive={isActive('/insights')} label="Insights" />
            <NavLink to="/profile" isActive={isActive('/profile')} label="Profile" />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(user?.displayName || user?.email)}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        <div className="md:hidden pb-3 border-t border-gray-200 mt-2 flex flex-wrap gap-2">
          <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')} label="Dashboard" />
          <MobileNavLink to="/debates" isActive={isActive('/debates')} label="Debates" />
          <MobileNavLink to="/arguments" isActive={isActive('/arguments')} label="Arguments" />
          <MobileNavLink to="/insights" isActive={isActive('/insights')} label="Insights" />
          <MobileNavLink to="/profile" isActive={isActive('/profile')} label="Profile" />
        </div>
      </div>
    </nav>
  );
};

/**
 * NavLink Component (Desktop)
 * Navigation link with active state styling
 */
const NavLink = ({ to, isActive, label }) => (
  <Link
    to={to}
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-purple-50 text-purple-600'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {label}
  </Link>
);

/**
 * MobileNavLink Component
 * Navigation link for mobile view
 */
const MobileNavLink = ({ to, isActive, label }) => (
  <Link
    to={to}
    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-purple-600 text-white'
        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
