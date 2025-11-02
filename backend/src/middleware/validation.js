import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Content creation validation (admin)
export const validateContentCreation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  body('type')
    .isIn(['movie', 'series', 'documentary'])
    .withMessage('Type must be movie, series, or documentary'),
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('releaseYear')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid release year'),
  body('rating')
    .isIn(['G', 'PG', 'PG-13', 'R', 'NC-17'])
    .withMessage('Invalid rating'),
  body('videoUrl')
    .isURL()
    .withMessage('Valid video URL is required'),
  body('thumbnailUrl')
    .isURL()
    .withMessage('Valid thumbnail URL is required'),
  body('bannerUrl')
    .isURL()
    .withMessage('Valid banner URL is required'),
  handleValidationErrors
];

// Content ID validation
export const validateContentId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid content ID'),
  handleValidationErrors
];

// Search query validation
export const validateSearchQuery = [
  query('q')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Search query must be at least 1 character'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('genre')
    .optional()
    .isAlpha()
    .withMessage('Genre must contain only letters'),
  query('type')
    .optional()
    .isIn(['movie', 'series', 'documentary'])
    .withMessage('Type must be movie, series, or documentary'),
  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name must be at least 1 character'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name must be at least 1 character'),
  body('profile.favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array'),
  body('profile.languagePreference')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Invalid language preference'),
  handleValidationErrors
];