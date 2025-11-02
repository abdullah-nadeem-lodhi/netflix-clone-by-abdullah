import { useContentCatalog, useContentSearch } from '@/hooks/useContent';
import ContentCard from './ContentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ContentGridProps {
  searchQuery?: string;
  genre?: string;
  pageSize?: number;
}

export default function ContentGrid({
  searchQuery,
  genre,
  pageSize = 20
}: ContentGridProps) {
  const filters = {
    limit: pageSize,
    genre: genre && genre !== 'featured' ? genre : undefined,
    featured: genre === 'featured' ? true : undefined
  };

  // Use search hook if there's a search query, otherwise use catalog hook
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError
  } = useContentSearch(searchQuery || '', filters);

  const {
    data: catalogData,
    isLoading: isCatalogLoading,
    error: catalogError
  } = useContentCatalog(searchQuery ? undefined : filters);

  const data = searchQuery ? searchData : catalogData;
  const isLoading = searchQuery ? isSearchLoading : isCatalogLoading;
  const error = searchQuery ? searchError : catalogError;

  const handleAddToWatchlist = (contentId: string) => {
    // TODO: Implement add to watchlist functionality
    console.log('Add to watchlist:', contentId);
  };

  const handlePlay = (contentId: string) => {
    // Navigate to watch page
    window.location.href = `/watch/${contentId}`;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-netflix-light-gray mb-4">
          Failed to load content. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : data && data.content.length > 0 ? (
        <>
          {/* Results summary */}
          <div className="mb-6">
            <p className="text-netflix-light-gray">
              {searchQuery
                ? `Found ${data.pagination.totalItems} results for "${searchQuery}"`
                : `Showing ${data.content.length} of ${data.pagination.totalItems} items`
              }
            </p>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.content.map((content) => (
              <ContentCard
                key={content._id}
                content={content}
                size="medium"
                showPlayButton={true}
                onAddToWatchlist={handleAddToWatchlist}
                onPlay={handlePlay}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                {/* Previous button */}
                <button
                  disabled={data.pagination.currentPage === 1}
                  className="px-4 py-2 bg-netflix-gray text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-netflix-black transition-colors"
                  onClick={() => {
                    const newPage = data.pagination.currentPage - 1;
                    const url = new URL(window.location.href);
                    url.searchParams.set('page', newPage.toString());
                    window.location.href = url.toString();
                  }}
                >
                  Previous
                </button>

                {/* Page numbers */}
                {[...Array(Math.min(5, data.pagination.totalPages))].map((_, index) => {
                  let pageNumber;
                  if (data.pagination.totalPages <= 5) {
                    pageNumber = index + 1;
                  } else {
                    const currentPage = data.pagination.currentPage;
                    if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= data.pagination.totalPages - 2) {
                      pageNumber = data.pagination.totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                  }

                  return (
                    <button
                      key={pageNumber}
                      className={`px-4 py-2 rounded transition-colors ${
                        pageNumber === data.pagination.currentPage
                          ? 'bg-netflix-red text-white'
                          : 'bg-netflix-gray text-white hover:bg-netflix-black'
                      }`}
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('page', pageNumber.toString());
                        window.location.href = url.toString();
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  disabled={data.pagination.currentPage === data.pagination.totalPages}
                  className="px-4 py-2 bg-netflix-gray text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-netflix-black transition-colors"
                  onClick={() => {
                    const newPage = data.pagination.currentPage + 1;
                    const url = new URL(window.location.href);
                    url.searchParams.set('page', newPage.toString());
                    window.location.href = url.toString();
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-netflix-light-gray text-lg">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'No content available in this category.'
            }
          </p>
          {searchQuery && (
            <p className="text-netflix-light-gray mt-2">
              Try different keywords or browse our categories.
            </p>
          )}
        </div>
      )}
    </div>
  );
}