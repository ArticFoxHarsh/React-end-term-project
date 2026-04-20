/**
 * Dashboard.jsx
 * 
 * Dashboard page - user's homepage after login.
 * Displays:
 * - Statistics row (total debates, win rate, average rating)
 * - Recent 5 debates
 * - CTA to log new debate
 * 
 * Route: /dashboard (protected)
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebates from '../hooks/useDebates';
import DebateCard from '../components/DebateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

/**
 * Dashboard Component
 * 
 * Displays authenticated user's debate statistics and recent debates.
 * Entry point for users to see their competitive speaking journey at a glance.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { debates, loading, deleteDebate } = useDebates();

  /**
   * Calculate statistics from debates
   * Memoized to avoid recalculating on every render
   * 
   * Returns:
   * {
   *   totalDebates: number,
   *   winRate: string (percentage),
   *   averageRating: string (decimal),
   *   recentDebates: Array (latest 5)
   * }
   */
  const stats = useMemo(() => {
    if (debates.length === 0) {
      return {
        totalDebates: 0,
        winRate: '0%',
        averageRating: '0.0',
        recentDebates: [],
      };
    }

    // Calculate total debates
    const totalDebates = debates.length;

    // Calculate win rate
    const wins = debates.filter((d) => d.outcome === 'Win').length;
    const winRate = totalDebates > 0 ? ((wins / totalDebates) * 100).toFixed(1) : '0';

    // Calculate average rating
    const totalRating = debates.reduce((sum, d) => sum + (d.rating || 0), 0);
    const averageRating = (totalRating / totalDebates).toFixed(1);

    // Get 5 most recent debates
    const recentDebates = debates.slice(0, 5);

    return {
      totalDebates,
      winRate: `${winRate}%`,
      averageRating,
      recentDebates,
    };
  }, [debates]);

  /**
   * Handle delete debate
   * Confirms deletion before removing from Firestore
   */
  const handleDelete = async (debateId) => {
    if (window.confirm('Are you sure you want to delete this debate?')) {
      try {
        await deleteDebate(debateId);
      } catch (error) {
        console.error('Failed to delete debate:', error);
        alert('Failed to delete debate. Please try again.');
      }
    }
  };

  /**
   * Handle edit debate
   * Navigate to edit page with debate ID
   */
  const handleEdit = (debateId) => {
    navigate(`/debates/${debateId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 uppercase">Dashboard</h1>
              <p className="text-gray-600 mt-2 font-medium">Track your competitive speaking journey</p>
            </div>
            {/* CTA Button */}
            <button
              onClick={() => navigate('/log')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 justify-center md:justify-start"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Log New Debate
            </button>
          </div>
        </div>

        {/* Statistics Row */}
        {stats.totalDebates > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Total Debates Stat */}
            <StatCard
              label="Total Debates"
              value={stats.totalDebates.toString()}
              icon="📊"
            />

            {/* Win Rate Stat */}
            <StatCard
              label="Win Rate"
              value={stats.winRate}
              icon="🏆"
            />

            {/* Average Rating Stat */}
            <StatCard
              label="Average Rating"
              value={`${stats.averageRating} / 5`}
              icon="⭐"
            />
          </div>
        )}

        {/* Recent Debates Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 uppercase">Recent Debates</h2>
            {stats.recentDebates.length > 0 && (
              <p className="text-gray-600 mt-1 font-medium">
                Showing {stats.recentDebates.length} of {stats.totalDebates} debate{stats.totalDebates !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Debates List or Empty State */}
          {stats.recentDebates.length > 0 ? (
            <div className="space-y-4">
              {stats.recentDebates.map((debate) => (
                <DebateCard
                  key={debate.id}
                  debate={debate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              {/* View All Button */}
              {stats.totalDebates > 5 && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => navigate('/debates')}
                    className="px-6 py-2 text-purple-600 hover:bg-purple-50 border border-purple-600 rounded-lg font-semibold transition-colors"
                  >
                    View All Debates →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              message="No debates logged yet. Start tracking your competitive speaking journey!"
              ctaText="Log Your First Debate"
              ctaLink="/log"
            />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * StatCard Component
 * Displays a single statistic in a card
 */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="text-3xl bg-purple-100 border border-gray-200 rounded-lg w-14 h-14 flex items-center justify-center">{icon}</div>
    </div>
  </div>
);

export default Dashboard;
