import Image from 'next/image';
import { Content } from '@/hooks/useContent';
import { PlayIcon, PlusIcon, ThumbUpIcon, ShareIcon } from '@heroicons/react/24/solid';

interface ContentDetailsProps {
  content: Content;
  onPlay: () => void;
  onAddToWatchlist: () => void;
}

export default function ContentDetails({ content, onPlay, onAddToWatchlist }: ContentDetailsProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    // TODO: Implement like/dislike functionality
    console.log('Like:', content.title);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>

        {/* Metadata */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-netflix-light-gray">{content.releaseYear}</span>
          <span className="text-netflix-light-gray">•</span>
          <span className="text-netflix-light-gray">{content.rating}</span>
          {content.type === 'movie' && content.duration && (
            <>
              <span className="text-netflix-light-gray">•</span>
              <span className="text-netflix-light-gray">{content.duration} min</span>
            </>
          )}
          {content.type === 'series' && content.seasons && content.seasons.length > 0 && (
            <>
              <span className="text-netflix-light-gray">•</span>
              <span className="text-netflix-light-gray">
                {content.seasons.length} Season{content.seasons.length > 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-white text-lg mb-6">{content.description}</p>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-8">
          {content.genres.map((genre) => (
            <span
              key={genre}
              className="bg-netflix-gray text-white px-3 py-1 rounded"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={onPlay}
            className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg font-semibold"
          >
            <PlayIcon className="w-5 h-5" />
            <span>Play</span>
          </button>

          <button
            onClick={onAddToWatchlist}
            className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg font-semibold"
          >
            <PlusIcon className="w-5 h-5" />
            <span>My List</span>
          </button>

          <button
            onClick={handleLike}
            className="btn-secondary flex items-center space-x-2 px-6 py-3"
          >
            <ThumbUpIcon className="w-5 h-5" />
            <span>Like</span>
          </button>

          <button
            onClick={handleShare}
            className="btn-secondary flex items-center space-x-2 px-6 py-3"
          >
            <ShareIcon className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Cast and Crew */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.cast && content.cast.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Cast</h3>
              <p className="text-netflix-light-gray">{content.cast.join(', ')}</p>
            </div>
          )}

          {content.director && content.director.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Director</h3>
              <p className="text-netflix-light-gray">{content.director.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Episodes (for series) */}
        {content.type === 'series' && content.seasons && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-white mb-4">Episodes</h3>
            <div className="space-y-6">
              {content.seasons.map((season) => (
                <div key={season.seasonNumber}>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Season {season.seasonNumber}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {season.episodes.map((episode) => (
                      <div
                        key={episode.episodeNumber}
                        className="bg-netflix-gray p-4 rounded-lg hover:bg-netflix-black transition-colors cursor-pointer"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-24 h-14 bg-gray-600 rounded flex-shrink-0">
                            <Image
                              src={episode.thumbnailUrl}
                              alt={episode.title}
                              width={96}
                              height={56}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-white font-semibold">
                              {episode.episodeNumber}. {episode.title}
                            </h5>
                            <p className="text-netflix-light-gray text-sm mt-1">
                              {episode.duration} min
                            </p>
                            <p className="text-netflix-light-gray text-sm mt-2 line-clamp-2">
                              {episode.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1">
        <div className="sticky top-4">
          {/* Thumbnail */}
          <div className="relative w-full aspect-video bg-netflix-gray rounded-lg overflow-hidden mb-6">
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Additional info */}
          <div className="space-y-4">
            <div>
              <h4 className="text-netflix-light-gray text-sm mb-1">Type</h4>
              <p className="text-white capitalize">{content.type}</p>
            </div>

            <div>
              <h4 className="text-netflix-light-gray text-sm mb-1">Quality</h4>
              <p className="text-white">HD 4K</p>
            </div>

            <div>
              <h4 className="text-netflix-light-gray text-sm mb-1">Audio</h4>
              <p className="text-white">English, Spanish, French</p>
            </div>

            <div>
              <h4 className="text-netflix-light-gray text-sm mb-1">Subtitles</h4>
              <p className="text-white">English, Spanish, French</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}