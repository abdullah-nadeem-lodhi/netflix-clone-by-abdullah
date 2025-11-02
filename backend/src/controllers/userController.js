import { User, Content } from '../models/index.js';

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const user = req.user;

      const profileData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile,
        subscription: user.subscription,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: profileData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const updateData = req.body;

      // Fields that are allowed to be updated
      const allowedUpdates = ['firstName', 'lastName', 'profile'];
      const actualUpdates = {};

      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          actualUpdates[key] = updateData[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        actualUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const profileData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile,
        subscription: user.subscription,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.json({
        success: true,
        data: profileData,
        message: 'Profile updated successfully'
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

  // Get user watchlist
  async getWatchlist(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate('watchlist', 'title thumbnailUrl type rating releaseYear')
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user.watchlist
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Add content to watchlist
  async addToWatchlist(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user._id;

      // Check if content exists
      const content = await Content.findById(contentId);
      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      // Add to watchlist (avoid duplicates)
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { watchlist: contentId } },
        { new: true }
      ).populate('watchlist', 'title thumbnailUrl type rating releaseYear')
       .lean();

      res.json({
        success: true,
        data: user.watchlist,
        message: 'Added to watchlist'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Remove content from watchlist
  async removeFromWatchlist(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user._id;

      // Remove from watchlist
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { watchlist: contentId } },
        { new: true }
      ).populate('watchlist', 'title thumbnailUrl type rating releaseYear')
       .lean();

      res.json({
        success: true,
        data: user.watchlist,
        message: 'Removed from watchlist'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get watch history
  async getWatchHistory(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const user = await User.findById(req.user._id)
        .populate({
          path: 'watchHistory.contentId',
          select: 'title thumbnailUrl type rating releaseYear duration'
        })
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Sort watch history by most recent
      const sortedHistory = user.watchHistory
        .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
        .slice(skip, skip + parseInt(limit));

      const total = user.watchHistory.length;

      res.json({
        success: true,
        data: sortedHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update watch history
  async updateWatchHistory(req, res) {
    try {
      const { contentId } = req.params;
      const { durationWatched, completed } = req.body;
      const userId = req.user._id;

      // Check if content exists
      const content = await Content.findById(contentId);
      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      // Update or add watch history entry
      const updateData = {
        contentId,
        watchedAt: new Date(),
        durationWatched: durationWatched || 0,
        completed: completed || false
      };

      // Remove existing entry for this content
      await User.findByIdAndUpdate(
        userId,
        { $pull: { watchHistory: { contentId } } }
      );

      // Add new entry
      await User.findByIdAndUpdate(
        userId,
        { $push: { watchHistory: updateData } }
      );

      res.json({
        success: true,
        message: 'Watch history updated'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get user statistics (for profile page)
  async getUserStats(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate('watchHistory.contentId', 'type duration')
        .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Calculate statistics
      const totalWatchTime = user.watchHistory.reduce((total, entry) => {
        return total + (entry.durationWatched || 0);
      }, 0);

      const completedContent = user.watchHistory.filter(entry => entry.completed).length;
      const totalWatched = user.watchHistory.length;
      const watchlistCount = user.watchlist.length;

      // Get content type breakdown
      const moviesWatched = user.watchHistory.filter(entry =>
        entry.contentId && entry.contentId.type === 'movie'
      ).length;

      const seriesWatched = user.watchHistory.filter(entry =>
        entry.contentId && entry.contentId.type === 'series'
      ).length;

      const stats = {
        totalWatchTime, // in minutes
        totalWatchTimeFormatted: this.formatWatchTime(totalWatchTime),
        completedContent,
        totalWatched,
        watchlistCount,
        moviesWatched,
        seriesWatched,
        averageWatchTime: totalWatched > 0 ? Math.round(totalWatchTime / totalWatched) : 0
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Helper method to format watch time
  formatWatchTime(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return remainingHours > 0
      ? `${days}d ${remainingHours}h`
      : `${days}d`;
  }
}

export default new UserController();