import { useState } from 'react';
import { useGenres } from '@/hooks/useContent';

interface SidebarProps {
  onGenreSelect: (genre: string) => void;
  selectedGenre: string;
}

export default function Sidebar({ onGenreSelect, selectedGenre }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: genres, isLoading } = useGenres();

  const mainGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller'];
  const allGenres = genres || mainGenres;

  return (
    <aside className={`bg-netflix-gray transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="h-full overflow-y-auto">
        {/* Toggle button */}
        <div className="p-4 border-b border-netflix-black">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full text-left text-netflix-light-gray hover:text-white transition-colors"
          >
            {isCollapsed ? '→' : '←'} {isCollapsed ? '' : 'Collapse'}
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => onGenreSelect('')}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              selectedGenre === ''
                ? 'bg-netflix-red text-white'
                : 'text-netflix-light-gray hover:text-white hover:bg-netflix-black'
            }`}
          >
            {isCollapsed ? '🏠' : 'All Content'}
          </button>

          <button
            onClick={() => onGenreSelect('featured')}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              selectedGenre === 'featured'
                ? 'bg-netflix-red text-white'
                : 'text-netflix-light-gray hover:text-white hover:bg-netflix-black'
            }`}
          >
            {isCollapsed ? '⭐' : 'Featured'}
          </button>

          {!isLoading && (
            <>
              <div className={`border-t border-netflix-black my-4 ${isCollapsed ? '' : ''}`} />

              {allGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => onGenreSelect(genre)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedGenre === genre
                      ? 'bg-netflix-red text-white'
                      : 'text-netflix-light-gray hover:text-white hover:bg-netflix-black'
                  }`}
                  title={isCollapsed ? genre : undefined}
                >
                  {isCollapsed ? genre.charAt(0) : genre}
                </button>
              ))}
            </>
          )}

          {isLoading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-netflix-black rounded animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}