import contentService from '../services/contentService.js';

class ContentController {
  // Get content catalog
  async getContentCatalog(req, res) {
    try {
      const {
        page,
        limit,
        genre,
        type,
        q: search,
        featured,
        sort: sortBy,
        order: sortOrder
      } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        genre,
        type,
        search,
        featured,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc'
      };

      const result = await contentService.getContentCatalog(options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get featured content
  async getFeaturedContent(req, res) {
    try {
      const { limit } = req.query;
      const featuredContent = await contentService.getFeaturedContent(
        limit ? parseInt(limit) : 10
      );

      res.json({
        success: true,
        data: featuredContent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get content by ID
  async getContentById(req, res) {
    try {
      const { id } = req.params;
      const content = await contentService.getContentById(id);

      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      if (error.message === 'Content not found') {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get content by genre
  async getContentByGenre(req, res) {
    try {
      const { genre } = req.params;
      const { page, limit } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20
      };

      const result = await contentService.getContentByGenre(genre, options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Search content
  async searchContent(req, res) {
    try {
      const { q: search, page, limit, type, genre } = req.query;

      if (!search) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        type,
        genre
      };

      const result = await contentService.searchContent(search, options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message.includes('Search term must be at least 2 characters')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Create new content (admin only)
  async createContent(req, res) {
    try {
      const contentData = req.body;
      const newContent = await contentService.createContent(contentData);

      res.status(201).json({
        success: true,
        data: newContent,
        message: 'Content created successfully'
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update content (admin only)
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedContent = await contentService.updateContent(id, updateData);

      res.json({
        success: true,
        data: updatedContent,
        message: 'Content updated successfully'
      });
    } catch (error) {
      if (error.message === 'Content not found') {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete content (admin only)
  async deleteContent(req, res) {
    try {
      const { id } = req.params;
      const deletedContent = await contentService.deleteContent(id);

      res.json({
        success: true,
        data: deletedContent,
        message: 'Content deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Content not found') {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all genres
  async getAllGenres(req, res) {
    try {
      const genres = await contentService.getAllGenres();

      res.json({
        success: true,
        data: genres
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get recommended content
  async getRecommendedContent(req, res) {
    try {
      const { limit } = req.query;

      // Get user preferences from authenticated user
      const userPreferences = {
        favoriteGenres: req.user?.profile?.favoriteGenres || [],
        watchHistory: req.user?.watchHistory?.map(item => item.contentId) || []
      };

      const recommendedContent = await contentService.getRecommendedContent(
        userPreferences,
        limit ? parseInt(limit) : 20
      );

      res.json({
        success: true,
        data: recommendedContent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new ContentController();