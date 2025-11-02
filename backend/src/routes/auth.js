import express from 'express';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - User registration
router.post('/register', validateUserRegistration, authController.register);

// POST /api/auth/login - User login
router.post('/login', validateUserLogin, authController.login);

// POST /api/auth/logout - User logout
router.post('/logout', authController.logout);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController.refreshToken);

// GET /api/auth/me - Get current user (protected route)
router.get('/me', protect, authController.getCurrentUser);

// POST /api/auth/forgot-password - Password reset request
router.post('/forgot-password', (req, res) => {
  res.json({
    success: true,
    message: 'Forgot password endpoint - to be implemented'
  });
});

// POST /api/auth/reset-password - Password reset confirmation
router.post('/reset-password', (req, res) => {
  res.json({
    success: true,
    message: 'Reset password endpoint - to be implemented'
  });
});

export default router;