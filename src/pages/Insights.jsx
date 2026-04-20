/**
 * Insights.jsx
 * 
 * Analytics and insights page with interactive charts.
 * Features:
 * - Win rate over time (LineChart)
 * - Outcomes breakdown (PieChart) - Win/Loss/Draw distribution
 * - Top topics (BarChart) - Most debated topics
 * 
 * All chart data is derived from real debates array from useDebates.
 * No hardcoded dummy data.
 * 
 * Route: /insights (protected, lazy-loaded)
 */

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useDebates from '../hooks/useDebates';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

// Chart colors
const COLORS = {
  Win: '#24d17f',
  Loss: '#ff5f6d',
  Draw: '#00b4d8',
  line: '#ff4fd8',
  bar: '#00f5d4',
};

/**
 * Insights Component
 * 
 * Displays interactive analytics charts based on user's debate data.
 * All data is calculated from real debates using useMemo.
 */
const Insights = () => {
  const { debates, loading } = useDebates();

  /**
   * Calculate win rate over time
   * Memoized to avoid recomputing on every render
   * 
   * Returns array of { date, winRate } for LineChart
   */
  const winRateData = useMemo(() => {
    if (debates.length === 0) return [];

    // Sort debates by date
    const sorted = [...debates].sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : a.date?.toDate?.() || new Date(0);
      const dateB = b.date instanceof Date ? b.date : b.date?.toDate?.() || new Date(0);
      return dateA - dateB;
    });

    // Calculate cumulative win rate at each point
    let wins = 0;
    return sorted.map((debate, index) => {
      if (debate.outcome === 'Win') {
        wins++;
      }
      const winRate = Math.round(((wins / (index + 1)) * 100));
      const dateObj = debate.date instanceof Date ? debate.date : debate.date?.toDate?.();
      const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) : 'Unknown';

      return {
        date: dateStr,
        winRate,
        fullDate: dateObj,
      };
    });
  }, [debates]);

  /**
   * Calculate outcome distribution
   * Memoized to avoid recomputing on every render
   * 
   * Returns array of { name, value } for PieChart
   */
  const outcomeData = useMemo(() => {
    if (debates.length === 0) return [];

    const outcomes = {
      Win: 0,
      Loss: 0,
      Draw: 0,
    };

    debates.forEach((debate) => {
      outcomes[debate.outcome] = (outcomes[debate.outcome] || 0) + 1;
    });

    return [
      { name: 'Win', value: outcomes.Win },
      { name: 'Loss', value: outcomes.Loss },
      { name: 'Draw', value: outcomes.Draw },
    ].filter((item) => item.value > 0);
  }, [debates]);

  /**
   * Calculate top topics
   * Memoized to avoid recomputing on every render
   * 
   * Returns array of { topic, count } for BarChart
   */
  const topicsData = useMemo(() => {
    if (debates.length === 0) return [];

    const topicCounts = {};

    debates.forEach((debate) => {
      topicCounts[debate.topic] = (topicCounts[debate.topic] || 0) + 1;
    });

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 topics
  }, [debates]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your insights..." />
      </div>
    );
  }

  // Empty state
  if (debates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 uppercase">Insights</h1>
            <p className="text-gray-600 mt-2 font-medium">Analyze your competitive speaking performance</p>
          </div>
          <EmptyState
            message="No debates logged yet. Start logging your debates to see insights and analytics!"
            ctaText="Log Your First Debate"
            ctaLink="/log"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 uppercase">Insights</h1>
          <p className="text-gray-600 mt-2 font-medium">Analyze your competitive speaking performance</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            label="Total Debates"
            value={debates.length}
            icon="📊"
          />
          <SummaryCard
            label="Win Rate"
            value={`${Math.round(
              (debates.filter((d) => d.outcome === 'Win').length / debates.length) * 100
            )}%`}
            icon="🏆"
          />
          <SummaryCard
            label="Average Rating"
            value={`${(
              debates.reduce((sum, d) => sum + (d.rating || 0), 0) / debates.length
            ).toFixed(1)} / 5`}
            icon="⭐"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win Rate Over Time */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase">Win Rate Over Time</h2>
            <div className="h-72 sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={winRateData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#9b8db8" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: `2px solid ${COLORS.line}`,
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke={COLORS.line}
                    dot={{ fill: COLORS.line, r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeWidth={3}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Outcomes Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase">Outcomes Breakdown</h2>
            <div className="h-72 sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={95}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {outcomeData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                  <Tooltip
                    formatter={(value) => `${value} debate${value !== 1 ? 's' : ''}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Topics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 uppercase">Top Debate Topics</h2>
            <div className="h-80 sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicsData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#9b8db8" />
                <XAxis
                  dataKey="topic"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  stroke="#6b7280"
                />
                <YAxis
                  label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: `2px solid ${COLORS.line}`,
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value} debate${value !== 1 ? 's' : ''}`}
                />
                  <Bar
                    dataKey="count"
                    fill={COLORS.bar}
                    stroke="#111111"
                    strokeWidth={2}
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights Summary */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 uppercase">📈 Key Insights</h3>
          <ul className="space-y-2 text-blue-800">
            <li>
              • You've logged <strong>{debates.length}</strong> debate{debates.length !== 1 ? 's' : ''}
            </li>
            <li>
              • Your current win rate is <strong>{Math.round(
                (debates.filter((d) => d.outcome === 'Win').length / debates.length) * 100
              )}%</strong>
            </li>
            {topicsData.length > 0 && (
              <li>
                • Your most debated topic is <strong>{topicsData[0].topic}</strong> with{' '}
                <strong>{topicsData[0].count}</strong> debate{topicsData[0].count !== 1 ? 's' : ''}
              </li>
            )}
            <li>
              • Your average debate rating is <strong>{(
                debates.reduce((sum, d) => sum + (d.rating || 0), 0) / debates.length
              ).toFixed(1)} out of 5</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * SummaryCard Component
 * Displays a single metric in a card
 */
const SummaryCard = ({ label, value, icon }) => (
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

export default Insights;
