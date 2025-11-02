import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { useContent } from '../../hooks/useContent';
import VideoPlayer from '../content/VideoPlayer';
import ContentDetails from '../content/ContentDetails';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProtectedRoute from '../auth/ProtectedRoute';

function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscription();
  const { getContentById, isLoading: contentLoading } = useContent();
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (id) {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      const contentData = await getContentById(id);
      setContent(contentData);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      // Redirect to browse page if content not found
      window.location.href = '/browse';
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
      <title>{content?.title || 'Watch'} - Netflix Clone</title>
      <meta name="description" content={content?.description || 'Watch content on Netflix Clone'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

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