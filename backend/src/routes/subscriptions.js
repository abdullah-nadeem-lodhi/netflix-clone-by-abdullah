import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import subscriptionController from '../controllers/subscriptionController.js';

const router = express.Router();

// GET /api/subscriptions/plans - Get available subscription plans
router.get('/plans', subscriptionController.getSubscriptionPlans);

// POST /api/subscriptions/create-checkout-session - Create Stripe checkout session
router.post('/create-checkout-session', protect, subscriptionController.createCheckoutSession);

// POST /api/subscriptions/webhook - Stripe webhook handler
router.post('/webhook', subscriptionController.handleStripeWebhook);

// GET /api/subscriptions/current - Get user's current subscription
router.get('/current', protect, subscriptionController.getCurrentSubscription);

// POST /api/subscriptions/cancel - Cancel subscription
router.post('/cancel', protect, subscriptionController.cancelSubscription);

// POST /api/subscriptions/update - Update subscription plan
router.post('/update', protect, subscriptionController.updateSubscription);

// POST /api/subscriptions/portal - Create customer portal session
router.post('/portal', protect, subscriptionController.createCustomerPortalSession);

// POST /api/subscriptions/initialize - Initialize subscription plans (admin only)
router.post('/initialize', protect, requireAdmin, subscriptionController.initializePlans);

export default router;