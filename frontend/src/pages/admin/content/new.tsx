import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function NewContentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createContent, isLoading } = useContent();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    genres: [],
    releaseYear: new Date().getFullYear(),
    duration: 0,
    rating: 'R',
    videoUrl: '',
    thumbnailUrl: '',
    bannerUrl: '',
    cast: [],
    director: [],
    featured: false,
    tags: []
  });
  const [error, setError] = useState('');

  // Check if user is admin
  if (user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createContent(formData);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create content');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
             type === 'number' ? Number(value) : value
    }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Add New Content - Admin</title>
        <meta name="description" content="Add new content to the catalog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-netflix-black">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Add New Content</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-netflix-gray p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="input-netflix w-full"
                    >
                      <option value="movie">Movie</option>
                      <option value="series">Series</option>
                      <option value="documentary">Documentary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Release Year *
                    </label>
                    <input
                      type="number"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      required
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Rating *
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="input-netflix w-full"
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="NC-17">NC-17</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-netflix-light-gray text-sm mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="input-netflix w-full"
                  />
                </div>

                {formData.type === 'movie' && (
                  <div className="mt-4">
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      required
                      className="input-netflix w-full"
                    />
                  </div>
                )}
              </div>

              {/* Media URLs */}
              <div className="bg-netflix-gray p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Media URLs</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      required
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Thumbnail URL *
                    </label>
                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      required
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Banner URL *
                    </label>
                    <input
                      type="url"
                      name="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={handleInputChange}
                      required
                      className="input-netflix w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Cast and Crew */}
              <div className="bg-netflix-gray p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Cast and Crew</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Cast (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.cast.join(', ')}
                      onChange={(e) => handleArrayInput('cast', e.target.value)}
                      placeholder="Actor 1, Actor 2, Actor 3"
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Director (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.director.join(', ')}
                      onChange={(e) => handleArrayInput('director', e.target.value)}
                      placeholder="Director 1, Director 2"
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Genres (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.genres.join(', ')}
                      onChange={(e) => handleArrayInput('genres', e.target.value)}
                      placeholder="Action, Drama, Thriller"
                      className="input-netflix w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-netflix-light-gray text-sm mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleArrayInput('tags', e.target.value)}
                      placeholder="Popular, New Release, Award Winner"
                      className="input-netflix w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="bg-netflix-gray p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Options</h2>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-netflix-light-gray">
                    Feature this content on the homepage
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isLoading && <LoadingSpinner size="small" />}
                  <span>Create Content</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}