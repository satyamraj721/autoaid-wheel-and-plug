/**
 * AUTOAID 360 - Service Model
 * MongoDB schema for available services (repairs, EV charging, etc.)
 */

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: [
      'roadside-assistance',
      'ev-charging',
      'battery-delivery',
      'accident-protection',
      'towing',
      'emergency-repair',
      'preventive-maintenance'
    ],
    required: true,
    default: 'roadside-assistance'
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Price must be a valid positive number'
    }
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours (480 minutes)']
  },
  availability: {
    type: String,
    enum: ['24/7', 'business-hours', 'scheduled'],
    default: '24/7'
  },
  serviceAreas: [{
    city: String,
    state: String,
    radius: Number // in kilometers
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  popularityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and search
serviceSchema.index({ title: 'text', description: 'text' }); // Text search
serviceSchema.index({ category: 1, isActive: 1 }); // Category filtering
serviceSchema.index({ price: 1 }); // Price sorting
serviceSchema.index({ createdBy: 1 }); // Creator lookup
serviceSchema.index({ 'rating.average': -1 }); // Rating sorting
serviceSchema.index({ popularityScore: -1 }); // Popularity sorting
serviceSchema.index({ createdAt: -1 }); // Recent services

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Virtual for duration display
serviceSchema.virtual('durationDisplay').get(function() {
  const hours = Math.floor(this.durationMinutes / 60);
  const minutes = this.durationMinutes % 60;
  
  if (hours === 0) return `${minutes} mins`;
  if (minutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return `${hours}h ${minutes}m`;
});

// Pre-save middleware
serviceSchema.pre('save', function(next) {
  // Auto-generate tags from title and description
  if (this.isModified('title') || this.isModified('description')) {
    const text = `${this.title} ${this.description}`.toLowerCase();
    const words = text.match(/\b\w{3,}\b/g) || [];
    this.tags = [...new Set(words)].slice(0, 10); // Unique words, max 10
  }
  next();
});

// Static method to get services by category
serviceSchema.statics.findByCategory = function(category, limit = 10) {
  return this.find({ category, isActive: true })
    .sort({ popularityScore: -1, 'rating.average': -1 })
    .limit(limit)
    .populate('createdBy', 'name email role');
};

// Static method to search services
serviceSchema.statics.searchServices = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    maxDuration,
    availability,
    limit = 20,
    sort = 'relevance'
  } = options;

  let searchQuery = {
    isActive: true,
    $text: { $search: query }
  };

  // Apply filters
  if (category) searchQuery.category = category;
  if (minPrice !== undefined) searchQuery.price = { ...searchQuery.price, $gte: minPrice };
  if (maxPrice !== undefined) searchQuery.price = { ...searchQuery.price, $lte: maxPrice };
  if (maxDuration) searchQuery.durationMinutes = { $lte: maxDuration };
  if (availability) searchQuery.availability = availability;

  let sortQuery = {};
  switch (sort) {
    case 'price-low': sortQuery = { price: 1 }; break;
    case 'price-high': sortQuery = { price: -1 }; break;
    case 'rating': sortQuery = { 'rating.average': -1 }; break;
    case 'duration': sortQuery = { durationMinutes: 1 }; break;
    case 'popular': sortQuery = { popularityScore: -1 }; break;
    default: sortQuery = { score: { $meta: 'textScore' } }; // relevance
  }

  return this.find(searchQuery)
    .sort(sortQuery)
    .limit(limit)
    .populate('createdBy', 'name role');
};

// Static method to get service statistics
serviceSchema.statics.getServiceStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgDuration: { $avg: '$durationMinutes' },
        avgRating: { $avg: '$rating.average' }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        avgPrice: { $round: ['$avgPrice', 2] },
        avgDuration: { $round: ['$avgDuration', 0] },
        avgRating: { $round: ['$avgRating', 1] },
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const Service = mongoose.model('Service', serviceSchema);

export default Service;