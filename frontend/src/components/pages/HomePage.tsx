import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import Hero from '../content/Hero';
import ContentRow from '../content/ContentRow';
import { useFeaturedContent, useContentByGenre } from '../../hooks/useContent';

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [genres, setGenres] = useState<string[]>([]);

  // Static genres for now - in a real app, these would come from an API
  useEffect(() => {
    setGenres([
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Romance',
      'Sci-Fi',
      'Thriller',
      'Documentary',
      'Animation',
      'Crime'
    ]);
  }, []);

  const { data: featuredContent, isLoading: featuredLoading } = useFeaturedContent();
  const { data: genreContent, isLoading: genreLoading } = useContentByGenre(selectedGenre);

  return (
    <>
      <title>Netflix Clone - Watch TV Shows & Movies Online</title>
      <meta name="description" content="Watch movies and TV shows online, stream popular content on your device." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <div className="min-h-screen bg-netflix-black">
        <Header />

        <main>
          {/* Hero Section */}
          {!featuredLoading && featuredContent?.length > 0 && (
            <Hero content={featuredContent[0]} />
          )}

          {/* Featured Content Row */}
          <ContentRow
            title="Featured"
            content={featuredContent}
            isLoading={featuredLoading}
          />

          {/* Dynamic Genre Rows */}
          {genres.slice(0, 6).map((genre) => (
            <ContentRow
              key={genre}
              title={genre}
              content={genreContent}
              isLoading={genreLoading}
              onGenreSelect={() => setSelectedGenre(genre)}
            />
          ))}

          {/* Continue Watching */}
          <ContentRow
            title="Continue Watching"
            content={[]} // Will be populated with user's watch history
            isLoading={false}
          />

          {/* My List */}
          <ContentRow
            title="My List"
            content={[]} // Will be populated with user's watchlist
            isLoading={false}
          />
        </main>
      </div>
    </>
  );
}