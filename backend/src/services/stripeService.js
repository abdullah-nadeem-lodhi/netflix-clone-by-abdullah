import Stripe from 'stripe';
import { User, Subscription } from '../models/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

class StripeService {
  // Subscription plans configuration
  static PLANS = {
    basic: {
      name: 'Basic',
      price: 8.99,
      currency: 'usd',
      interval: 'month',
      features: [
        { feature: 'SD Quality (480p)', included: true },
        { feature: 'Single Screen', included: true },
        { feature: 'Limited Catalog', included: true },
        { feature: 'HD Quality', included: false },
        { feature: 'Multiple Screens', included: false },
        { feature: '4K Quality', included: false },
        { feature: 'Downloads', included: false }
      ],
      maxConcurrentStreams: 1,
      maxVideoQuality: 'SD'
    },
    standard: {
      name: 'Standard',
      price: 13.99,
      currency: 'usd',
      interval: 'month',
      features: [
        { feature: 'HD Quality (1080p)', included: true },
        { feature: '2 Screens', included: true },
        { feature: 'Full Catalog', included: true },
        { feature: 'Downloads', included: true },
        { feature: 'SD Quality', included: true },
        { feature: '4K Quality', included: false },
        { feature: '4 Screens', included: false }
      ],
      maxConcurrentStreams: 2,
      maxVideoQuality: 'HD'
    },
    premium: {
      name: 'Premium',
      price: 17.99,
      currency: 'usd',
      interval: 'month',
      features: [
        { feature: '4K+HDR Quality', included: true },
        { feature: '4 Screens', included: true },
        { feature: 'Full Catalog', included: true },
        { feature: 'Downloads', included: true },
        { feature: 'Offline Viewing', included: true },
        { feature: 'HD Quality', included: true },
        { feature: 'SD Quality', included: true }
      ],
      maxConcurrentStreams: 4,
      maxVideoQuality: '4K'
    }
  };

  // Initialize subscription plans in Stripe and database
  async initializePlans() {
    try {
      for (const [planKey, planData] of Object.entries(this.PLANS)) {
        // Check if plan already exists in database
        const existingPlan = await Subscription.findOne({ name: planData.name });

        if (!existingPlan) {
          // Create product in Stripe
          const product = await stripe.products.create({
            name: planData.name,
            description: `${planData.name} subscription plan`,
            metadata: {
              planKey,
              maxConcurrentStreams: planData.maxConcurrentStreams.toString(),
              maxVideoQuality: planData.maxVideoQuality
            }
          });

          // Create price in Stripe
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(planData.price * 100), // Convert to cents
            currency: planData.currency,
            recurring: {
              interval: planData.interval,
            },
            metadata: {
              planKey
            }
          });

          // Save to database
          const subscriptionPlan = new Subscription({
            name: planData.name,
            stripePriceId: price.id,
            price: planData.price,
            currency: planData.currency,
            interval: planData.interval,
            features: planData.features,
            maxConcurrentStreams: planData.maxConcurrentStreams,
            maxVideoQuality: planData.maxVideoQuality,
            displayOrder: planKey === 'basic' ? 1 : planKey === 'standard' ? 2 : 3
          });

          await subscriptionPlan.save();

          console.log(`Initialized ${planData.name} plan`);
        }
      }
    } catch (error) {
      console.error('Error initializing plans:', error);
      throw error;
    }
  }

  // Create checkout session
  async createCheckoutSession(userId, priceId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get price information
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product);

      let stripeCustomerId = user.subscription.stripeCustomerId;

      // Create or retrieve Stripe customer
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user._id.toString()
          }
        });
        stripeCustomerId = customer.id;

        // Save customer ID to user
        user.subscription.stripeCustomerId = stripeCustomerId;
        await user.save();
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/plans`,
        metadata: {
          userId: user._id.toString(),
          planKey: product.metadata.planKey
        },
        subscription_data: {
          metadata: {
            userId: user._id.toString(),
            planKey: product.metadata.planKey
          }
        }
      });

      return { sessionId: session.id, url: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Create customer portal session
  async createCustomerPortalSession(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.subscription.stripeCustomerId) {
        throw new Error('No Stripe customer found');
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.subscription.stripeCustomerId,
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`,
      });

      return { url: session.url };
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  // Handle webhook events
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionChange(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Handle subscription creation/update
  async handleSubscriptionChange(subscription) {
    try {
      const userId = subscription.metadata.userId;
      const planKey = subscription.metadata.planKey;

      if (!userId || !planKey) {
        console.error('Missing metadata in subscription');
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        console.error('User not found for subscription');
        return;
      }

      // Get plan details from database
      const plan = await Subscription.findOne({ name: this.PLANS[planKey].name });
      if (!plan) {
        console.error('Plan not found');
        return;
      }

      // Update user subscription
      user.subscription.status = subscription.status;
      user.subscription.plan = planKey;
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;

      await user.save();
      console.log(`Updated subscription for user ${userId}`);
    } catch (error) {
      console.error('Error handling subscription change:', error);
      throw error;
    }
  }

  // Handle subscription cancellation
  async handleSubscriptionCancellation(subscription) {
    try {
      const userId = subscription.metadata.userId;
      if (!userId) {
        console.error('Missing userId in subscription metadata');
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        console.error('User not found for subscription cancellation');
        return;
      }

      // Update user subscription status
      user.subscription.status = 'cancelled';
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscription.cancelAtPeriodEnd = true;

      await user.save();
      console.log(`Cancelled subscription for user ${userId}`);
    } catch (error) {
      console.error('Error handling subscription cancellation:', error);
      throw error;
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(invoice) {
    try {
      const subscriptionId = invoice.subscription;
      if (!subscriptionId) return;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await this.handleSubscriptionChange(subscription);

      console.log(`Payment succeeded for subscription ${subscriptionId}`);
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  // Handle failed payment
  async handlePaymentFailure(invoice) {
    try {
      const subscriptionId = invoice.subscription;
      if (!subscriptionId) return;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata.userId;

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          user.subscription.status = 'past_due';
          await user.save();
        }
      }

      console.log(`Payment failed for subscription ${subscriptionId}`);
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.subscription.stripeCustomerId) {
        throw new Error('No active subscription found');
      }

      // Get subscription from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: user.subscription.stripeCustomerId,
        status: 'active',
      });

      if (subscriptions.data.length === 0) {
        throw new Error('No active subscription found');
      }

      const subscription = subscriptions.data[0];

      // Cancel at period end
      const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });

      // Update user record
      user.subscription.cancelAtPeriodEnd = true;
      await user.save();

      return updatedSubscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Update subscription
  async updateSubscription(userId, newPriceId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.subscription.stripeCustomerId) {
        throw new Error('No active subscription found');
      }

      // Get current subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: user.subscription.stripeCustomerId,
        status: 'active',
      });

      if (subscriptions.data.length === 0) {
        throw new Error('No active subscription found');
      }

      const currentSubscription = subscriptions.data[0];

      // Update subscription
      const updatedSubscription = await stripe.subscriptions.update(currentSubscription.id, {
        items: [{
          id: currentSubscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations',
      });

      // Get new plan details
      const newPrice = await stripe.prices.retrieve(newPriceId);
      const newProduct = await stripe.products.retrieve(newPrice.product);
      const planKey = newProduct.metadata.planKey;

      // Update user record
      if (planKey) {
        user.subscription.plan = planKey;
        await user.save();
      }

      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }
}

export default new StripeService();