import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, FileText, Search, TrendingUp, Calendar, Activity, Download } from 'lucide-react';
import { getAdminAnalytics } from '../services/api';
import { Button } from '../components/ui/button';
import { formatDate, formatNumber } from '../utils/formatters';
import { useToast } from '../hooks/use-toast';
import UserInfoModal from '../components/UserInfoModal';
import AdminAuthModal from '../components/AdminAuthModal';
import { userStorage } from '../utils/userStorage';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      loadAnalytics();
    }
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      const userInfo = userStorage.getUserInfo();
      if (!userInfo) {
        return;
      }
      const data = await getAdminAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      addToast('Failed to load analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    sessionStorage.setItem('adminAuthenticated', 'true');
    loadAnalytics();
  };

  const handleAuthClose = () => {
    // Redirect back to search if authentication is cancelled
    window.location.href = '/search';
  };

  const handleExport = () => {
    // Export analytics data to CSV
    if (!analytics) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', analytics.totalUsers],
      ['Total Documents', analytics.totalDocuments],
      ['Total Searches', analytics.totalSearches],
      ['Average Searches per User', analytics.totalUsers > 0 ? (analytics.totalSearches / analytics.totalUsers).toFixed(1) : '0'],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const userInfo = userStorage.getUserInfo();
  if (!userInfo) {
    return <UserInfoModal />;
  }

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return <AdminAuthModal isOpen={showAuthModal} onClose={handleAuthClose} onSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics data</p>
          <Button onClick={loadAnalytics} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor usage and engagement metrics</p>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button onClick={handleExport} variant="outline">
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-blue-600" size={24} />
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalUsers)}</div>
            <p className="text-sm text-gray-600 mt-1">Active Users</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <FileText className="text-green-600" size={24} />
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalDocuments)}</div>
            <p className="text-sm text-gray-600 mt-1">Documents</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Search className="text-purple-600" size={24} />
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">+25%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalSearches)}</div>
            <p className="text-sm text-gray-600 mt-1">Searches</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="text-orange-600" size={24} />
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">+5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.totalUsers > 0 ? (analytics.totalSearches / analytics.totalUsers).toFixed(1) : '0'}
            </div>
            <p className="text-sm text-gray-600 mt-1">Searches per User</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Search Activity Over Time */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Search Activity</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} className="text-green-500" />
                <span>15% increase</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.searchTrends}>
                <defs>
                  <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSearch)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Engagement Score */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                { subject: 'Searches', A: 85, fullMark: 100 },
                { subject: 'Uploads', A: 70, fullMark: 100 },
                { subject: 'Views', A: 90, fullMark: 100 },
                { subject: 'Shares', A: 60, fullMark: 100 },
                { subject: 'Comments', A: 45, fullMark: 100 },
                { subject: 'Ratings', A: 80, fullMark: 100 },
              ]}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" stroke="#6B7280" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" fontSize={10} />
                <Radar name="Engagement" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Document Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Document Categories</h2>
              <span className="text-sm text-gray-500">{analytics.categoryBreakdown?.length || 0} categories</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.categoryBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Upload Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upload Trends</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} className="text-green-500" />
                <span>8% increase</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.uploadTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Team Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Team Breakdown</h2>
              <span className="text-sm text-gray-500">{analytics.teamBreakdown?.length || 0} teams</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.teamBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.teamBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Searches */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
              <span className="text-sm text-gray-500">Last 10 searches</span>
            </div>
            <div className="space-y-2">
              {analytics.recentSearches?.slice(0, 5).map((search, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{search.query}</p>
                    <p className="text-xs text-gray-600">
                      by {search.userName} • {search.resultsCount} results
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(search.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Projects and Top Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trending Queries */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Trending Queries</h2>
              <span className="text-sm text-gray-500">Hot searches</span>
            </div>
            <div className="space-y-2">
              {analytics.trendingQueries?.slice(0, 5).map((query, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{query.query}</p>
                    <p className="text-xs text-gray-600">Searched {query.count} times</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(query.lastSearched)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Popular Projects</h2>
              <span className="text-sm text-gray-500">Top 5</span>
            </div>
            <div className="space-y-2">
              {analytics.popularProjects?.slice(0, 5).map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{project.project}</p>
                    <p className="text-xs text-gray-600">{project.documentCount} documents</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(project.lastUpload)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Users</h2>
              <span className="text-sm text-gray-500">Most active</span>
            </div>
            <div className="space-y-2">
              {analytics.topUsers?.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{user.documentCount} docs</p>
                    <p className="text-xs text-gray-500">{user.searchCount} searches</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
