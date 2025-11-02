import stripeService from '../services/stripeService.js';

class SubscriptionController {
  // Get available subscription plans
  async getSubscriptionPlans(req, res) {
    try {
      const { Subscription } = await import('../models/index.js');
      const plans = await Subscription.find({ isActive: true }).sort({ displayOrder: 1 });

      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Create Stripe checkout session
  async createCheckoutSession(req, res) {
    try {
      const { priceId } = req.body;
      const userId = req.user._id;

      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: 'Price ID is required'
        });
      }

      const session = await stripeService.createCheckoutSession(userId, priceId);

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          url: session.url
        }
      });
    } catch (error) {
      console.error('Checkout session error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create checkout session'
      });
    }
  }

  // Handle Stripe webhook
  async handleStripeWebhook(req, res) {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        return res.status(400).json({
          success: false,
          error: 'Stripe signature or webhook secret missing'
        });
      }

      let event;

      try {
        // Verify webhook signature
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({
          success: false,
          error: 'Webhook signature verification failed'
        });
      }

      // Handle the event
      await stripeService.handleWebhook(event);

      res.json({
        success: true,
        received: true
      });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Webhook processing failed'
      });
    }
  }

  // Get current subscription
  async getCurrentSubscription(req, res) {
    try {
      const user = req.user;

      if (!user.subscription.stripeCustomerId) {
        return res.json({
          success: true,
          data: null
        });
      }

      const subscriptionData = {
        status: user.subscription.status,
        plan: user.subscription.plan,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        stripeCustomerId: user.subscription.stripeCustomerId
      };

      res.json({
        success: true,
        data: subscriptionData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Cancel subscription
  async cancelSubscription(req, res) {
    try {
      const userId = req.user._id;

      const updatedSubscription = await stripeService.cancelSubscription(userId);

      res.json({
        success: true,
        data: updatedSubscription,
        message: 'Subscription will be cancelled at the end of the billing period'
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to cancel subscription'
      });
    }
  }

  // Update subscription plan
  async updateSubscription(req, res) {
    try {
      const { priceId } = req.body;
      const userId = req.user._id;

      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: 'Price ID is required'
        });
      }

      const updatedSubscription = await stripeService.updateSubscription(userId, priceId);

      res.json({
        success: true,
        data: updatedSubscription,
        message: 'Subscription updated successfully'
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update subscription'
      });
    }
  }

  // Create customer portal session
  async createCustomerPortalSession(req, res) {
    try {
      const userId = req.user._id;

      const portalSession = await stripeService.createCustomerPortalSession(userId);

      res.json({
        success: true,
        data: {
          url: portalSession.url
        }
      });
    } catch (error) {
      console.error('Portal session error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create portal session'
      });
    }
  }

  // Initialize subscription plans (admin only)
  async initializePlans(req, res) {
    try {
      await stripeService.initializePlans();

      res.json({
        success: true,
        message: 'Subscription plans initialized successfully'
      });
    } catch (error) {
      console.error('Initialize plans error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initialize plans'
      });
    }
  }
}

export default new SubscriptionController();