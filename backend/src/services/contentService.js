import { Content } from '../models/index.js';

class ContentService {
  // Get content catalog with pagination and filtering
  async getContentCatalog(options = {}) {
    const {
      page = 1,
      limit = 20,
      genre,
      type,
      search,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = { isActive: true };

    // Build filter conditions
    if (genre) {
      query.genres = { $in: [genre] };
    }

    if (type) {
      query.type = type;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [content, total] = await Promise.all([
      Content.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(query)
    ]);

    return {
      content,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  // Get featured content
  async getFeaturedContent(limit = 10) {
    const featuredContent = await Content.find({
      isActive: true,
      featured: true
    })
      .sort({ popularity: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return featuredContent;
  }

  // Get content by ID
  async getContentById(id) {
    const content = await Content.findOne({
      _id: id,
      isActive: true
    }).lean();

    if (!content) {
      throw new Error('Content not found');
    }

    return content;
  }

  // Get content by genre
  async getContentByGenre(genre, options = {}) {
    const { page = 1, limit = 20 } = options;

    const query = {
      isActive: true,
      genres: { $in: [genre] }
    };

    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      Content.find(query)
        .sort({ popularity: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(query)
    ]);

    return {
      content,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  // Search content
  async searchContent(searchTerm, options = {}) {
    const { page = 1, limit = 20, type, genre } = options;

    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters long');
    }

    const query = {
      isActive: true,
      $text: { $search: searchTerm.trim() }
    };

    if (type) {
      query.type = type;
    }

    if (genre) {
      query.genres = { $in: [genre] };
    }

    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      Content.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(query)
    ]);

    return {
      content,
      searchQuery: searchTerm,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  // Create new content (admin only)
  async createContent(contentData) {
    const content = new Content(contentData);
    await content.save();

    // Return content as plain object
    return content.toObject();
  }

  // Update content (admin only)
  async updateContent(id, updateData) {
    const content = await Content.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!content) {
      throw new Error('Content not found');
    }

    return content;
  }

  // Delete content (admin only)
  async deleteContent(id) {
    // Soft delete by setting isActive to false
    const content = await Content.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!content) {
      throw new Error('Content not found');
    }

    return content;
  }

  // Get all genres
  async getAllGenres() {
    const genres = await Content.distinct('genres', { isActive: true });
    return genres.sort();
  }

  // Get content recommendations based on user preferences
  async getRecommendedContent(userPreferences = {}, limit = 20) {
    const { favoriteGenres = [], watchHistory = [] } = userPreferences;

    // Build query based on user preferences
    const query = { isActive: true };

    if (favoriteGenres.length > 0) {
      // Prioritize favorite genres
      query.genres = { $in: favoriteGenres };
    }

    // Exclude content already in watch history
    if (watchHistory.length > 0) {
      query._id = { $nin: watchHistory };
    }

    const recommendedContent = await Content.find(query)
      .sort({ popularity: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return recommendedContent;
  }
}

export default new ContentService();