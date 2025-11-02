import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  feature: {
    type: String,
    required: true
  },
  included: {
    type: Boolean,
    required: true
  }
});

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stripePriceId: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    required: true
  },
  features: [featureSchema],
  maxConcurrentStreams: {
    type: Number,
    required: true,
    min: 1
  },
  maxVideoQuality: {
    type: String,
    enum: ['SD', 'HD', '4K'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for active plans ordering
subscriptionSchema.index({
  isActive: 1,
  displayOrder: 1,
  price: 1
});

export default mongoose.model('Subscription', subscriptionSchema);