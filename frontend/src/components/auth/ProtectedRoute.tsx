import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({
  children,
  requireSubscription = false
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = requireSubscription
    ? require('@/hooks/useSubscription').useSubscription()
    : { hasActiveSubscription: true, isLoading: false };

  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setIsRedirecting(true);
      const currentPath = router.asPath;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!authLoading && !subscriptionLoading && requireSubscription && !hasActiveSubscription) {
      setIsRedirecting(true);
      router.push('/plans');
      return;
    }
  }, [user, authLoading, subscriptionLoading, hasActiveSubscription, requireSubscription, router]);

  // Show loading state while checking authentication
  if (authLoading || subscriptionLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-netflix-light-gray">
            {isRedirecting ? 'Redirecting...' : 'Checking access...'}
          </p>
        </div>
      </div>
    );
  }

  // If user is authenticated (and has subscription if required), render children
  if (user && (!requireSubscription || hasActiveSubscription)) {
    return <>{children}</>;
  }

  // Fallback - should not reach here due to redirects above
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-netflix-white">Loading...</p>
      </div>
    </div>
  );
}