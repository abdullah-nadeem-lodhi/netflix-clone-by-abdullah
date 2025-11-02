import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  }
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: {
    type: Number,
    required: true
  },
  episodes: [episodeSchema]
});

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'series', 'documentary'],
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  releaseYear: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // Only for movies
    required: function() {
      return this.type === 'movie';
    }
  },
  seasons: [seasonSchema], // Only for series
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    required: true
  },
  cast: [{
    type: String
  }],
  director: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text search index
contentSchema.index({
  title: 'text',
  description: 'text',
  cast: 'text',
  director: 'text'
});

// Compound index for filtering
contentSchema.index({
  type: 1,
  genres: 1,
  isActive: 1,
  featured: 1
});

export default mongoose.model('Content', contentSchema);