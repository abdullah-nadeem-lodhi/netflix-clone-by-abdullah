import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface PaymentStatusProps {
  status: 'processing' | 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

export default function PaymentStatus({ status, message, details }: PaymentStatusProps) {
  const statusConfig = {
    processing: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-900/50',
      borderColor: 'border-blue-600',
      iconColor: 'text-blue-400',
      title: 'Processing'
    },
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-900/50',
      borderColor: 'border-green-600',
      iconColor: 'text-green-400',
      title: 'Success'
    },
    error: {
      icon: ExclamationCircleIcon,
      bgColor: 'bg-red-900/50',
      borderColor: 'border-red-600',
      iconColor: 'text-red-400',
      title: 'Error'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-600',
      iconColor: 'text-gray-400',
      title: 'Info'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{config.title}</h3>
          <p className="text-netflix-light-gray text-sm mb-2">{message}</p>
          {details && (
            <p className="text-netflix-light-gray text-xs opacity-75">{details}</p>
          )}
        </div>
      </div>

      {/* Processing indicator */}
      {status === 'processing' && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-blue-400 text-sm">Please wait...</span>
          </div>
        </div>
      )}

      {/* Success confetti effect */}
      {status === 'success' && (
        <div className="mt-4">
          <div className="flex space-x-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}