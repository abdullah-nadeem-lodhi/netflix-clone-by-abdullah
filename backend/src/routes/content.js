import express from 'express';
import { protect, requireSubscription, requireAdmin } from '../middleware/auth.js';
import { validateContentId, validateContentCreation, validateSearchQuery } from '../middleware/validation.js';
import contentController from '../controllers/contentController.js';

const router = express.Router();

// GET /api/content - Get content catalog (with pagination, filtering)
router.get('/', validateSearchQuery, contentController.getContentCatalog);

// GET /api/content/featured - Get featured content
router.get('/featured', contentController.getFeaturedContent);

// GET /api/content/genres - Get all available genres
router.get('/genres', contentController.getAllGenres);

// GET /api/content/recommendations - Get recommended content (protected)
router.get('/recommendations', protect, contentController.getRecommendedContent);

// GET /api/content/search - Search content
router.get('/search', validateSearchQuery, contentController.searchContent);

// GET /api/content/:id - Get content details
router.get('/:id', validateContentId, contentController.getContentById);

// GET /api/content/genre/:genre - Get content by genre
router.get('/genre/:genre', contentController.getContentByGenre);

// POST /api/content - Admin: Create new content
router.post('/', protect, requireAdmin, validateContentCreation, contentController.createContent);

// PUT /api/content/:id - Admin: Update content
router.put('/:id', protect, requireAdmin, validateContentId, contentController.updateContent);

// DELETE /api/content/:id - Admin: Delete content
router.delete('/:id', protect, requireAdmin, validateContentId, contentController.deleteContent);

export default router;