/**
 * Navbar.jsx
 * 
 * Top navigation component displaying:
 * - Logo/brand name on the left
 * - Navigation links (dashboard, debates, insights, profile)
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
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo / Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-bold text-xl sm:text-2xl text-gray-900"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 text-sm font-bold">DV</span>
            </div>
            <div className="leading-tight">
              <span className="block">DebateVault</span>
              <span className="text-xs text-gray-600 font-medium tracking-wide uppercase">Neon Arena</span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/dashboard" isActive={isActive('/dashboard')} label="Dashboard" />
            <NavLink to="/debates" isActive={isActive('/debates')} label="Debates" />
            <NavLink to="/insights" isActive={isActive('/insights')} label="Insights" />
            <NavLink to="/profile" isActive={isActive('/profile')} label="Profile" />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-gray-900 text-sm font-semibold border border-gray-200">
              {getInitials(user?.displayName || user?.email)}
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        <div className="md:hidden border-t border-gray-200 px-4 pb-3 pt-2 mt-1">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')} label="Dashboard" />
            <MobileNavLink to="/debates" isActive={isActive('/debates')} label="Debates" />
            <MobileNavLink to="/insights" isActive={isActive('/insights')} label="Insights" />
            <MobileNavLink to="/profile" isActive={isActive('/profile')} label="Profile" />
          </div>
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
    className={`px-3 py-2 text-sm font-semibold rounded-md border border-gray-200 shadow-sm transition-colors ${
      isActive
        ? 'bg-purple-600 text-gray-900'
        : 'text-gray-700 bg-white hover:bg-gray-100'
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
    className={`px-3 py-1.5 whitespace-nowrap text-sm font-semibold rounded-md border border-gray-200 shadow-sm transition-colors ${
      isActive
        ? 'bg-purple-600 text-gray-900'
        : 'text-gray-700 bg-white hover:bg-gray-100'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
