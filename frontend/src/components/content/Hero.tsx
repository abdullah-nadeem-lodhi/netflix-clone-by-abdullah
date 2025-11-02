import Image from 'next/image';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { Content } from '@/hooks/useContent';

interface HeroProps {
  content: Content;
}

export default function Hero({ content }: HeroProps) {
  const handlePlay = () => {
    window.location.href = `/watch/${content._id}`;
  };

  const handleMoreInfo = () => {
    // TODO: Open content details modal or navigate to details page
    console.log('More info for:', content.title);
  };

  return (
    <div className="relative h-[70vh] min-h-[400px] w-full">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={content.bannerUrl}
          alt={content.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {content.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-netflix-light-gray">
                {content.releaseYear}
              </span>
              <span className="text-netflix-light-gray">•</span>
              <span className="text-netflix-light-gray">
                {content.rating}
              </span>
              {content.type === 'movie' && content.duration && (
                <>
                  <span className="text-netflix-light-gray">•</span>
                  <span className="text-netflix-light-gray">
                    {content.duration} min
                  </span>
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
            <p className="text-white text-lg mb-6 line-clamp-3">
              {content.description}
            </p>

            {/* Action buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handlePlay}
                className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg font-semibold"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Play</span>
              </button>

              <button
                onClick={handleMoreInfo}
                className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg font-semibold"
              >
                <InformationCircleIcon className="w-5 h-5" />
                <span>More Info</span>
              </button>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-6">
              {content.genres.map((genre) => (
                <span
                  key={genre}
                  className="text-sm bg-netflix-gray bg-opacity-80 text-white px-3 py-1 rounded"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-netflix-black to-transparent" />
    </div>
  );
}