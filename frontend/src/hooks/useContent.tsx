import { useState } from 'react';
import { useQuery } from 'react-query';
import { api } from './useAuth';

// Types
interface Content {
  _id: string;
  title: string;
  description: string;
  type: 'movie' | 'series' | 'documentary';
  genres: string[];
  releaseYear: number;
  duration?: number;
  seasons?: Array<{
    seasonNumber: number;
    episodes: Array<{
      episodeNumber: number;
      title: string;
      description: string;
      duration: number;
      videoUrl: string;
      thumbnailUrl: string;
    }>;
  }>;
  videoUrl: string;
  thumbnailUrl: string;
  bannerUrl: string;
  rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  cast: string[];
  director: string[];
  featured: boolean;
  isActive: boolean;
  tags: string[];
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentResponse {
  content: Content[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Query keys
export const contentKeys = {
  all: ['content'] as const,
  catalog: (filters: any) => [...contentKeys.all, 'catalog', filters] as const,
  featured: () => [...contentKeys.all, 'featured'] as const,
  byId: (id: string) => [...contentKeys.all, 'id', id] as const,
  byGenre: (genre: string, filters: any) => [...contentKeys.all, 'genre', genre, filters] as const,
  search: (query: string, filters: any) => [...contentKeys.all, 'search', query, filters] as const,
  genres: () => [...contentKeys.all, 'genres'] as const,
  recommendations: () => [...contentKeys.all, 'recommendations'] as const,
};

// API functions
const fetchContentCatalog = async (filters: any = {}): Promise<ContentResponse> => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null) {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/content?${params.toString()}`);
  return response.data.data;
};

const fetchFeaturedContent = async (): Promise<Content[]> => {
  const response = await api.get('/content/featured?limit=10');
  return response.data.data;
};

const fetchContentById = async (id: string): Promise<Content> => {
  const response = await api.get(`/content/${id}`);
  return response.data.data;
};

const fetchContentByGenre = async (genre: string, filters: any = {}): Promise<ContentResponse> => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null) {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/content/genre/${genre}?${params.toString()}`);
  return response.data.data;
};

const searchContent = async (query: string, filters: any = {}): Promise<ContentResponse> => {
  const params = new URLSearchParams({ q: query });

  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null) {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/content/search?${params.toString()}`);
  return response.data.data;
};

const fetchGenres = async (): Promise<string[]> => {
  const response = await api.get('/content/genres');
  return response.data.data;
};

const fetchRecommendedContent = async (): Promise<Content[]> => {
  const response = await api.get('/content/recommendations');
  return response.data.data;
};

// Hooks
export function useContentCatalog(filters: any = {}) {
  return useQuery(
    contentKeys.catalog(filters),
    () => fetchContentCatalog(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
    }
  );
}

export function useFeaturedContent() {
  return useQuery(
    contentKeys.featured(),
    fetchFeaturedContent,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useContentById(id: string) {
  return useQuery(
    contentKeys.byId(id),
    () => fetchContentById(id),
    {
      enabled: !!id,
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );
}

export function useContentByGenre(genre: string, filters: any = {}) {
  return useQuery(
    contentKeys.byGenre(genre, filters),
    () => fetchContentByGenre(genre, filters),
    {
      enabled: !!genre,
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
    }
  );
}

export function useContentSearch(query: string, filters: any = {}) {
  return useQuery(
    contentKeys.search(query, filters),
    () => searchContent(query, filters),
    {
      enabled: !!query && query.length >= 2,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

export function useGenres() {
  return useQuery(
    contentKeys.genres(),
    fetchGenres,
    {
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  );
}

export function useRecommendedContent() {
  return useQuery(
    contentKeys.recommendations(),
    fetchRecommendedContent,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

// Combined hook for general content operations
export function useContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContentById = async (id: string): Promise<Content> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/content/${id}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createContent = async (contentData: Partial<Content>): Promise<Content> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/content', contentData);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (id: string, contentData: Partial<Content>): Promise<Content> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.put(`/content/${id}`, contentData);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContent = async (id: string): Promise<Content> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.delete(`/content/${id}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    isLoading,
    error,
  };
}