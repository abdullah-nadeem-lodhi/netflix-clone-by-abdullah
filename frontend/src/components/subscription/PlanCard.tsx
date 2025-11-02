import { CheckIcon } from '@heroicons/react/24/solid';
import { SubscriptionPlan } from '@/hooks/useSubscription';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
  isProcessing?: boolean;
  isCurrentPlan?: boolean;
}

export default function PlanCard({
  plan,
  onSelect,
  isProcessing = false,
  isCurrentPlan = false
}: PlanCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const popularFeatures = [
    'Unlimited movies and TV shows',
    'Watch on any device',
    'Cancel anytime',
  ];

  return (
    <div className={`relative bg-netflix-gray p-6 rounded-lg transition-all duration-300 hover:scale-105 ${
      plan.name === 'Standard' ? 'ring-2 ring-netflix-red scale-105' : ''
    }`}>
      {/* Popular badge */}
      {plan.name === 'Standard' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-netflix-red text-white px-4 py-1 rounded-full text-sm font-semibold">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            CURRENT PLAN
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">
            {formatPrice(plan.price, plan.currency)}
          </span>
          <span className="text-netflix-light-gray">/{plan.interval}</span>
        </div>
        <p className="text-netflix-light-gray text-sm">
          {plan.maxVideoQuality} • {plan.maxConcurrentStreams} screen{plan.maxConcurrentStreams > 1 ? 's' : ''}
        </p>
      </div>

      {/* Features list */}
      <div className="space-y-3 mb-8">
        {/* Popular features that all plans have */}
        {popularFeatures.map((feature) => (
          <div key={feature} className="flex items-center space-x-3">
            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-netflix-light-gray text-sm">{feature}</span>
          </div>
        ))}

        {/* Plan-specific features */}
        {plan.features.map((feature) => (
          <div key={feature.feature} className="flex items-center space-x-3">
            {feature.included ? (
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 border-2 border-netflix-light-gray rounded-full flex-shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? 'text-netflix-light-gray' : 'text-gray-500'}`}>
              {feature.feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button
        onClick={onSelect}
        disabled={isProcessing || isCurrentPlan}
        className={`w-full py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
          isCurrentPlan
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : isProcessing
            ? 'bg-gray-600 text-gray-400 cursor-wait'
            : plan.name === 'Standard'
            ? 'bg-netflix-red text-white hover:bg-red-600'
            : 'btn-secondary'
        }`}
      >
        {isCurrentPlan
          ? 'Current Plan'
          : isProcessing
          ? 'Processing...'
          : 'Get Started'}
      </button>

      {/* Additional info */}
      <div className="mt-4 text-center">
        <p className="text-netflix-light-gray text-xs">
          {plan.interval === 'year' ? 'Save 20% with annual billing' : 'Monthly billing'}
        </p>
      </div>
    </div>
  );
}