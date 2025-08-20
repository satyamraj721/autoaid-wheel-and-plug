/**
 * AUTOAID 360 - Booking Model
 * MongoDB schema for service bookings and appointments
 */

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for booking']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required for booking']
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Scheduled time must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
    required: true
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    validate: {
      validator: async function(value) {
        if (!value) return true; // Optional field
        const user = await mongoose.model('User').findById(value);
        return user && (user.role === 'mechanic' || user.role === 'admin');
      },
      message: 'Assigned mechanic must have mechanic or admin role'
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'Service address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    licensePlate: String,
    vehicleType: {
      type: String,
      enum: ['car', 'motorcycle', 'truck', 'ev', 'hybrid'],
      default: 'car'
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number']
    },
    alternatePhone: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'whatsapp', 'sms'],
      default: 'phone'
    }
  },
  problemDescription: {
    type: String,
    trim: true,
    maxlength: [1000, 'Problem description cannot exceed 1000 characters']
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    default: 'cash'
  },
  timeline: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date
  },
  rating: {
    score: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    feedback: {
      type: String,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false // false = visible to customer, true = internal only
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
bookingSchema.index({ user: 1, createdAt: -1 }); // User's bookings
bookingSchema.index({ mechanic: 1, status: 1 }); // Mechanic's assignments
bookingSchema.index({ status: 1, scheduledAt: 1 }); // Status and schedule
bookingSchema.index({ scheduledAt: 1 }); // Schedule queries
bookingSchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial queries

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (this.timeline.completedAt && this.timeline.startedAt) {
    return Math.round((this.timeline.completedAt - this.timeline.startedAt) / (1000 * 60)); // minutes
  }
  return null;
});

// Virtual for total timeline duration
bookingSchema.virtual('totalDuration').get(function() {
  if (this.timeline.completedAt && this.timeline.createdAt) {
    return Math.round((this.timeline.completedAt - this.timeline.createdAt) / (1000 * 60 * 60)); // hours
  }
  return null;
});

// Virtual for status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending Assignment',
    'accepted': 'Mechanic Assigned',
    'in-progress': 'Service in Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'no-show': 'No Show'
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware to update timeline
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'accepted':
        if (!this.timeline.acceptedAt) this.timeline.acceptedAt = now;
        break;
      case 'in-progress':
        if (!this.timeline.startedAt) this.timeline.startedAt = now;
        break;
      case 'completed':
        if (!this.timeline.completedAt) this.timeline.completedAt = now;
        break;
      case 'cancelled':
        if (!this.timeline.cancelledAt) this.timeline.cancelledAt = now;
        break;
    }
  }
  next();
});

// Instance method to add note
bookingSchema.methods.addNote = function(author, message, isInternal = false) {
  this.notes.push({
    author,
    message,
    isInternal,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to update status with validation
bookingSchema.methods.updateStatus = function(newStatus, userId) {
  const validTransitions = {
    'pending': ['accepted', 'cancelled'],
    'accepted': ['in-progress', 'cancelled', 'no-show'],
    'in-progress': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': [],
    'no-show': []
  };

  if (!validTransitions[this.status]?.includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  return this.save();
};

// Static method to get bookings by user
bookingSchema.statics.findByUser = function(userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('service', 'title category price durationMinutes')
    .populate('mechanic', 'name phone email')
    .sort({ createdAt: -1 });
};

// Static method to get bookings by mechanic
bookingSchema.statics.findByMechanic = function(mechanicId, status = null) {
  const query = { mechanic: mechanicId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('service', 'title category price durationMinutes')
    .populate('user', 'name phone email')
    .sort({ scheduledAt: 1 });
};

// Static method to get booking statistics
bookingSchema.statics.getBookingStats = function(dateRange = {}) {
  const matchStage = {};
  if (dateRange.start && dateRange.end) {
    matchStage.createdAt = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$actualCost' },
        avgRating: { $avg: '$rating.score' }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        avgRating: { $round: ['$avgRating', 1] },
        _id: 0
      }
    }
  ]);
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;