import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import ContentGrid from '../content/ContentGrid';
import SearchBar from '../ui/SearchBar';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProtectedRoute from '../auth/ProtectedRoute';

function BrowsePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Show loading state while checking auth and subscription
  if (authLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <title>Browse - Netflix Clone</title>
      <meta name="description" content="Browse our catalog of movies and TV shows" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <div className="min-h-screen bg-netflix-black">
        <Header />

        <div className="flex">
          <Sidebar
            onGenreSelect={setSelectedGenre}
            selectedGenre={selectedGenre}
          />

          <main className="flex-1 p-6">
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search for movies, TV shows..."
              />
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-netflix-white mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Content'}
              </h1>
              {selectedGenre && (
                <p className="text-netflix-light-gray">
                  Genre: {selectedGenre}
                </p>
              )}
            </div>

            <ContentGrid
              searchQuery={searchQuery}
              genre={selectedGenre}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default BrowsePage;