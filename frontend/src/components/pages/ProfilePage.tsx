import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import Header from '../layout/Header';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProtectedRoute from '../auth/ProtectedRoute';

function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, currentSubscription, cancelSubscription } = useSubscription();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      setIsCancelling(true);
      try {
        await cancelSubscription();
        alert('Subscription will be cancelled at the end of your billing period.');
      } catch (error) {
        alert('Failed to cancel subscription. Please try again.');
      }
      setIsCancelling(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <title>Profile - Netflix Clone</title>
      <meta name="description" content="Manage your Netflix Clone profile" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <div className="min-h-screen bg-netflix-black">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="bg-netflix-gray p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-netflix-light-gray text-sm mb-1">Email</label>
                  <p className="text-white">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-netflix-light-gray text-sm mb-1">Name</label>
                  <p className="text-white">{user?.firstName} {user?.lastName}</p>
                </div>

                <div>
                  <label className="block text-netflix-light-gray text-sm mb-1">Member Since</label>
                  <p className="text-white">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-netflix-gray p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Subscription</h2>

              {hasActiveSubscription ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-1">Current Plan</label>
                    <p className="text-white capitalize">{currentSubscription?.plan || 'Standard'}</p>
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-1">Status</label>
                    <p className="text-green-400">Active</p>
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-1">Next Billing Date</label>
                    <p className="text-white">
                      {currentSubscription?.currentPeriodEnd
                        ? new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>

                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    className="btn-secondary w-full"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-netflix-light-gray">No active subscription</p>
                  <a href="/plans" className="btn-primary block text-center">
                    Choose a Plan
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-netflix-gray p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-netflix-light-gray text-sm mb-2">Language</label>
                <select className="input-netflix w-full">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>

              <div>
                <label className="block text-netflix-light-gray text-sm mb-2">Autoplay</label>
                <select className="input-netflix w-full">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>

            <button className="btn-primary mt-6">Save Changes</button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ProfilePage;