import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { api } from './useAuth';

// Types
interface SubscriptionPlan {
  _id: string;
  name: string;
  stripePriceId: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: Array<{
    feature: string;
    included: boolean;
  }>;
  maxConcurrentStreams: number;
  maxVideoQuality: 'SD' | 'HD' | '4K';
  isActive: boolean;
  displayOrder: number;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[] | null;
  isLoading: boolean;
  error: string | null;
  hasActiveSubscription: boolean;
  currentSubscription: any | null;
  createCheckoutSession: (priceId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (priceId: string) => Promise<void>;
  getCurrentSubscription: () => Promise<void>;
}

// Create context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Subscription provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasActiveSubscription = currentSubscription?.status === 'active' &&
    new Date(currentSubscription.currentPeriodEnd) > new Date();

  // Fetch available plans
  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/subscriptions/plans');
      setPlans(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch plans:', error);
      setError(error.response?.data?.error || 'Failed to load subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current subscription
  const getCurrentSubscription = async () => {
    try {
      const response = await api.get('/subscriptions/current');
      setCurrentSubscription(response.data.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch current subscription:', error);
      }
      // 404 means user has no subscription, which is fine
      setCurrentSubscription(null);
    }
  };

  // Create checkout session
  const createCheckoutSession = async (priceId: string) => {
    try {
      setError(null);
      const response = await api.post('/subscriptions/create-checkout-session', {
        priceId,
      });

      const { sessionId } = response.data.data;

      // Redirect to Stripe checkout
      const stripe = await import('@stripe/stripe-js').then((module) =>
        module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      );

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create checkout session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setError(null);
      await api.post('/subscriptions/cancel');
      await getCurrentSubscription(); // Refresh subscription status
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to cancel subscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update subscription
  const updateSubscription = async (priceId: string) => {
    try {
      setError(null);
      await api.post('/subscriptions/update', {
        priceId,
      });
      await getCurrentSubscription(); // Refresh subscription status
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update subscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchPlans();
    getCurrentSubscription();
  }, []);

  const value: SubscriptionContextType = {
    plans,
    isLoading,
    error,
    hasActiveSubscription,
    currentSubscription,
    createCheckoutSession,
    cancelSubscription,
    updateSubscription,
    getCurrentSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook to use subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}