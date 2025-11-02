import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useContent } from '@/hooks/useContent';
import VideoPlayer from '@/components/content/VideoPlayer';
import ContentDetails from '@/components/content/ContentDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscription();
  const { getContentById, isLoading: contentLoading } = useContent();
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      const contentData = await getContentById(id as string);
      setContent(contentData);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      // Redirect to browse page if content not found
      router.push('/browse');
    }
  };

  // Show loading state
  if (authLoading || subscriptionLoading || contentLoading || !content) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>{content?.title || 'Watch'} - Netflix Clone</title>
        <meta name="description" content={content?.description || 'Watch content on Netflix Clone'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-netflix-black">
        {/* Video Player */}
        <VideoPlayer
          content={content}
          onEnded={() => {
            // Handle video ended - maybe show next episode or recommendations
            console.log('Video ended');
          }}
          onProgress={(progress) => {
            // Update watch history
            console.log('Video progress:', progress);
          }}
        />

        {/* Content Details */}
        <div className="container mx-auto px-4 py-8">
          <ContentDetails
            content={content}
            onPlay={() => {
              // Handle play/pause
              console.log('Play/Pause');
            }}
            onAddToWatchlist={() => {
              // Handle adding to watchlist
              console.log('Add to watchlist');
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default WatchPage;