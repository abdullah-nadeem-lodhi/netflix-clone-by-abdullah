import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateProfileUpdate } from '../middleware/validation.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// GET /api/users/profile - Get user profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', validateProfileUpdate, userController.updateProfile);

// GET /api/users/stats - Get user statistics
router.get('/stats', userController.getUserStats);

// GET /api/users/watchlist - Get user watchlist
router.get('/watchlist', userController.getWatchlist);

// POST /api/users/watchlist/:contentId - Add to watchlist
router.post('/watchlist/:contentId', userController.addToWatchlist);

// DELETE /api/users/watchlist/:contentId - Remove from watchlist
router.delete('/watchlist/:contentId', userController.removeFromWatchlist);

// GET /api/users/history - Get watch history
router.get('/history', userController.getWatchHistory);

// POST /api/users/history/:contentId - Update watch history
router.post('/history/:contentId', userController.updateWatchHistory);

export default router;