import { Content } from '@/hooks/useContent';
import ContentCard from './ContentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ContentRowProps {
  title: string;
  content: Content[] | null;
  isLoading: boolean;
  onGenreSelect?: () => void;
  size?: 'small' | 'medium' | 'large';
  showPlayButton?: boolean;
}

export default function ContentRow({
  title,
  content,
  isLoading,
  onGenreSelect,
  size = 'medium',
  showPlayButton = true
}: ContentRowProps) {
  const handleAddToWatchlist = (contentId: string) => {
    // TODO: Implement add to watchlist functionality
    console.log('Add to watchlist:', contentId);
  };

  const handlePlay = (contentId: string) => {
    // Navigate to watch page
    window.location.href = `/watch/${contentId}`;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {onGenreSelect && (
          <button
            onClick={onGenreSelect}
            className="text-netflix-light-gray hover:text-white transition-colors text-sm"
          >
            Explore all →
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`${
                size === 'small' ? 'w-32 h-48' :
                size === 'large' ? 'w-64 h-96' :
                'w-48 h-72'
              } bg-netflix-gray rounded-lg animate-pulse flex-shrink-0`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && content && content.length > 0 && (
        <div className="relative group">
          {/* Gradient fade effect on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-netflix-black to-transparent z-10 pointer-events-none" />

          {/* Gradient fade effect on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-netflix-black to-transparent z-10 pointer-events-none" />

          {/* Scrollable content container */}
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {content.map((item) => (
              <div key={item._id} className="flex-shrink-0">
                <ContentCard
                  content={item}
                  size={size}
                  showPlayButton={showPlayButton}
                  onAddToWatchlist={handleAddToWatchlist}
                  onPlay={handlePlay}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!content || content.length === 0) && (
        <div className="text-center py-8">
          <p className="text-netflix-light-gray">
            No content found for this category.
          </p>
        </div>
      )}
    </div>
  );
}

// Custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
if (!document.head.querySelector('style[data-scrollbar-hide]')) {
  style.setAttribute('data-scrollbar-hide', 'true');
  document.head.appendChild(style);
}