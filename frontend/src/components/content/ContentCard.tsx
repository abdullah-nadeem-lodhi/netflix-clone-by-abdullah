import { Link } from 'react-router-dom';
import { PlayIcon, PlusIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { Content } from '../../hooks/useContent';

interface ContentCardProps {
  content: Content;
  size?: 'small' | 'medium' | 'large';
  showPlayButton?: boolean;
  onAddToWatchlist?: (contentId: string) => void;
  onPlay?: (contentId: string) => void;
}

export default function ContentCard({
  content,
  size = 'medium',
  showPlayButton = true,
  onAddToWatchlist,
  onPlay
}: ContentCardProps) {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-48 h-72',
    large: 'w-64 h-96'
  };

  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWatchlist?.(content._id);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay?.(content._id);
  };

  return (
    <Link to={`/watch/${content._id}`}>
      <div className={`content-card ${sizeClasses[size]} relative group cursor-pointer rounded-lg overflow-hidden`}>
        {/* Thumbnail */}
        <div className="relative w-full h-full">
          <img
            src={content.thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <div className="content-card-overlay absolute inset-0 flex flex-col justify-end p-4">
          {/* Title */}
          <h3 className={`${fontSizeClasses[size]} font-semibold text-white mb-2 line-clamp-2`}>
            {content.title}
          </h3>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {showPlayButton && (
              <button
                onClick={handlePlay}
                className="bg-netflix-white text-netflix-black p-2 rounded-full hover:bg-opacity-80 transition-all duration-200 transform hover:scale-110"
                title="Play"
              >
                <PlayIcon className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleAddToWatchlist}
              className="bg-netflix-gray bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
              title="Add to My List"
            >
              <PlusIcon className="w-4 h-4" />
            </button>

            <button
              className="bg-netflix-gray bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
              title="More Info"
            >
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-2 mt-2 text-xs text-netflix-light-gray">
            <span>{content.releaseYear}</span>
            <span>•</span>
            <span>{content.rating}</span>
            {content.type === 'movie' && content.duration && (
              <>
                <span>•</span>
                <span>{content.duration} min</span>
              </>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mt-2">
            {content.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-netflix-red bg-opacity-80 text-white px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Featured badge */}
        {content.featured && (
          <div className="absolute top-2 left-2 bg-netflix-red text-white text-xs px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
    </Link>
  );
}