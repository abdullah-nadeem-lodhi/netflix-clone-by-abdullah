import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/content/Hero';
import ContentRow from '@/components/content/ContentRow';
import { useFeaturedContent, useContentByGenre } from '@/hooks/useContent';

interface HomePageProps {
  genres: string[];
}

export default function HomePage({ genres }: HomePageProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const { data: featuredContent, isLoading: featuredLoading } = useFeaturedContent();
  const { data: genreContent, isLoading: genreLoading } = useContentByGenre(selectedGenre);

  return (
    <>
      <Head>
        <title>Netflix Clone - Watch TV Shows & Movies Online</title>
        <meta name="description" content="Watch movies and TV shows online, stream popular content on your device." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

export const getStaticProps: GetStaticProps = async () => {
  // In a real app, fetch these from your API
  const genres = [
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
  ];

  return {
    props: {
      genres,
    },
    revalidate: 3600, // Revalidate every hour
  };
};