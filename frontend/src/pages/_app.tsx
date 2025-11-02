import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import '@/styles/globals.css';
import { AuthProvider } from '@/store/AuthContext';
import { SubscriptionProvider } from '@/store/SubscriptionContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <Component {...pageProps} />
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;