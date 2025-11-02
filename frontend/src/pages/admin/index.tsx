import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { createContent, isLoading: contentLoading } = useContent();
  const [activeTab, setActiveTab] = useState('overview');

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if user is admin
  if (user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin Dashboard - Netflix Clone</title>
        <meta name="description" content="Admin dashboard for content and user management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-netflix-black">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-netflix-gray mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-netflix-red text-white'
                  : 'border-transparent text-netflix-light-gray hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-netflix-red text-white'
                  : 'border-transparent text-netflix-light-gray hover:text-white'
              }`}
            >
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-netflix-red text-white'
                  : 'border-transparent text-netflix-light-gray hover:text-white'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-2 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-netflix-red text-white'
                  : 'border-transparent text-netflix-light-gray hover:text-white'
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value="1,234"
                    change="+12%"
                    changeType="positive"
                  />
                  <StatCard
                    title="Active Subscriptions"
                    value="892"
                    change="+8%"
                    changeType="positive"
                  />
                  <StatCard
                    title="Total Content"
                    value="456"
                    change="+24"
                    changeType="positive"
                  />
                  <StatCard
                    title="Revenue (MTD)"
                    value="$12,345"
                    change="+15%"
                    changeType="positive"
                  />
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Content Management</h2>
                  <button
                    onClick={() => router.push('/admin/content/new')}
                    className="btn-primary"
                  >
                    Add New Content
                  </button>
                </div>

                <div className="bg-netflix-gray rounded-lg p-6">
                  <p className="text-netflix-light-gray">
                    Content management interface will be implemented here.
                    This will include features for adding, editing, and organizing movies and TV shows.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
                <div className="bg-netflix-gray rounded-lg p-6">
                  <p className="text-netflix-light-gray">
                    User management interface will be implemented here.
                    This will include user search, subscription management, and support tools.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Analytics</h2>
                <div className="bg-netflix-gray rounded-lg p-6">
                  <p className="text-netflix-light-gray">
                    Analytics dashboard will be implemented here.
                    This will include viewing statistics, revenue reports, and user engagement metrics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

function StatCard({ title, value, change, changeType }: StatCardProps) {
  return (
    <div className="bg-netflix-gray p-6 rounded-lg">
      <h3 className="text-netflix-light-gray text-sm mb-2">{title}</h3>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className={`text-sm ${
        changeType === 'positive' ? 'text-green-400' : 'text-red-400'
      }`}>
        {change}
      </div>
    </div>
  );
}

export default AdminDashboard;