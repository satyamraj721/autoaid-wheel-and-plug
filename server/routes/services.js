/**
 * AUTOAID 360 - Services Routes
 * Service management endpoints for CRUD operations
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize, mechanicOrAdmin, adminOnly, optionalAuth } from '../middleware/auth.js';
import Service from '../models/Service.js';

const router = express.Router();

/**
 * GET /api/services
 * Get all services (public endpoint with optional auth)
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    search,
    minPrice,
    maxPrice,
    maxDuration,
    availability,
    sortBy = 'popularityScore',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { isActive: true };
  
  if (category && [
    'roadside-assistance', 'ev-charging', 'battery-delivery', 
    'accident-protection', 'towing', 'emergency-repair', 'preventive-maintenance'
  ].includes(category)) {
    query.category = category;
  }
  
  if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
  if (maxDuration) query.durationMinutes = { $lte: parseInt(maxDuration) };
  if (availability) query.availability = availability;

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Build sort
  const sort = {};
  if (search) {
    sort.score = { $meta: 'textScore' };
  } else {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [services, totalServices] = await Promise.all([
    Service.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name role')
      .lean(),
    Service.countDocuments(query)
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalServices / parseInt(limit));

  res.status(200).json({
    success: true,
    message: 'Services retrieved successfully',
    data: {
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalServices,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      },
      filters: {
        category,
        search,
        minPrice,
        maxPrice,
        maxDuration,
        availability
      }
    }
  });
}));

/**
 * GET /api/services/categories
 * Get service categories with counts
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Service.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$rating.average' }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        avgPrice: { $round: ['$avgPrice', 2] },
        avgRating: { $round: ['$avgRating', 1] },
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    message: 'Service categories retrieved successfully',
    data: {
      categories
    }
  });
}));

/**
 * GET /api/services/featured
 * Get featured services (popular/high-rated)
 */
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const services = await Service.find({ isActive: true })
    .sort({ 
      popularityScore: -1, 
      'rating.average': -1,
      'rating.totalReviews': -1 
    })
    .limit(parseInt(limit))
    .populate('createdBy', 'name role')
    .lean();

  res.status(200).json({
    success: true,
    message: 'Featured services retrieved successfully',
    data: {
      services
    }
  });
}));

/**
 * GET /api/services/:id
 * Get service by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id)
    .populate('createdBy', 'name role email phone')
    .lean();

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  if (!service.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Service is no longer available'
    });
  }

  // Increment popularity score (simple view counter)
  await Service.findByIdAndUpdate(id, {
    $inc: { popularityScore: 1 }
  });

  res.status(200).json({
    success: true,
    message: 'Service retrieved successfully',
    data: {
      service
    }
  });
}));

/**
 * POST /api/services
 * Create new service (Mechanic/Admin only)
 */
router.post('/', authenticate, mechanicOrAdmin, asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category = 'roadside-assistance',
    price,
    durationMinutes,
    availability = '24/7',
    serviceAreas,
    requirements,
    features
  } = req.body;

  // Validation
  if (!title || !description || !price || !durationMinutes) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, price, and duration are required'
    });
  }

  if (price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price cannot be negative'
    });
  }

  if (durationMinutes < 15 || durationMinutes > 480) {
    return res.status(400).json({
      success: false,
      message: 'Duration must be between 15 and 480 minutes'
    });
  }

  // Create service
  const serviceData = {
    title: title.trim(),
    description: description.trim(),
    category,
    price: parseFloat(price),
    durationMinutes: parseInt(durationMinutes),
    availability,
    serviceAreas: serviceAreas || [],
    requirements: requirements || [],
    features: features || [],
    createdBy: req.user._id,
    isActive: true
  };

  const service = new Service(serviceData);
  await service.save();

  // Populate creator info
  await service.populate('createdBy', 'name role');

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: {
      service
    }
  });
}));

/**
 * PUT /api/services/:id
 * Update service (Mechanic/Admin only - own services or admin)
 */
router.put('/:id', authenticate, mechanicOrAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Check ownership (mechanic can only edit own services, admin can edit all)
  if (req.user.role === 'mechanic' && service.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only edit your own services'
    });
  }

  const allowedUpdates = [
    'title', 'description', 'category', 'price', 'durationMinutes',
    'availability', 'serviceAreas', 'requirements', 'features', 'isActive'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields to update',
      allowedFields: allowedUpdates
    });
  }

  // Additional validation
  if (updates.price !== undefined && updates.price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price cannot be negative'
    });
  }

  if (updates.durationMinutes !== undefined && 
      (updates.durationMinutes < 15 || updates.durationMinutes > 480)) {
    return res.status(400).json({
      success: false,
      message: 'Duration must be between 15 and 480 minutes'
    });
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name role');

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: {
      service: updatedService
    }
  });
}));

/**
 * DELETE /api/services/:id
 * Delete service (Admin only)
 */
router.delete('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Soft delete by setting isActive to false
  await Service.findByIdAndUpdate(id, { isActive: false });

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
}));

/**
 * POST /api/services/:id/rate
 * Rate a service (Authenticated users only)
 */
router.post('/:id/rate', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Update rating (simplified - in production, you'd track individual ratings)
  const currentTotal = service.rating.average * service.rating.totalReviews;
  const newTotalReviews = service.rating.totalReviews + 1;
  const newAverage = (currentTotal + rating) / newTotalReviews;

  service.rating.average = Math.round(newAverage * 10) / 10; // Round to 1 decimal
  service.rating.totalReviews = newTotalReviews;

  await service.save();

  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    data: {
      rating: service.rating
    }
  });
}));

/**
 * GET /api/services/my/services
 * Get current user's services (Mechanic only)
 */
router.get('/my/services', authenticate, authorize('mechanic', 'admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = { createdBy: req.user._id };
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [services, totalServices] = await Promise.all([
    Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Service.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalServices / parseInt(limit));

  res.status(200).json({
    success: true,
    message: 'Your services retrieved successfully',
    data: {
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalServices,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    }
  });
}));

export default router;