import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSubscription } from '@/hooks/useSubscription';
import Header from '@/components/layout/Header';
import PlanCard from '@/components/subscription/PlanCard';
import PaymentStatus from '@/components/subscription/PaymentStatus';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function PlansPage() {
  const router = useRouter();
  const { plans, createCheckoutSession, isLoading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setIsProcessing(true);

    try {
      await createCheckoutSession(plan.stripePriceId);
      // User will be redirected to Stripe checkout
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Choose Your Plan - Netflix Clone</title>
        <meta name="description" content="Choose the perfect subscription plan for your entertainment needs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-netflix-black">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-netflix-white mb-4">
              Choose the plan that's right for you
            </h1>
            <p className="text-xl text-netflix-light-gray">
              Join today and get instant access to our entire catalog
            </p>
          </div>

          {isProcessing && (
            <div className="mb-8">
              <PaymentStatus
                status="processing"
                message="Redirecting to secure payment..."
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans?.map((plan) => (
              <PlanCard
                key={plan.stripePriceId}
                plan={plan}
                onSelect={() => handleSelectPlan(plan)}
                isProcessing={isProcessing && selectedPlan?.stripePriceId === plan.stripePriceId}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-netflix-white mb-6">
              Why choose Netflix Clone?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-netflix-red text-3xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold text-netflix-white mb-2">
                  Huge Library
                </h3>
                <p className="text-netflix-light-gray">
                  Thousands of movies and TV shows at your fingertips
                </p>
              </div>
              <div className="text-center">
                <div className="text-netflix-red text-3xl mb-4">📱</div>
                <h3 className="text-lg font-semibold text-netflix-white mb-2">
                  Watch Anywhere
                </h3>
                <p className="text-netflix-light-gray">
                  Stream on your phone, tablet, laptop, and TV
                </p>
              </div>
              <div className="text-center">
                <div className="text-netflix-red text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold text-netflix-white mb-2">
                  No Commitments
                </h3>
                <p className="text-netflix-light-gray">
                  Cancel online anytime, no contracts or hidden fees
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-netflix-light-gray mb-4">
              Questions? Call 1-800-NETFLIX
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm text-netflix-light-gray">
              <div>FAQ</div>
              <div>Help Center</div>
              <div>Terms of Use</div>
              <div>Privacy</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlansPage;