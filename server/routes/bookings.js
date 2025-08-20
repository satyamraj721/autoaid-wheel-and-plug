/**
 * AUTOAID 360 - Bookings Routes
 * Service booking management endpoints
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize, mechanicOrAdmin, adminOnly } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/bookings
 * Create new booking (Customer only)
 */
router.post('/', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const {
    serviceId,
    scheduledAt,
    location,
    vehicleInfo,
    contactInfo,
    problemDescription,
    urgencyLevel = 'medium'
  } = req.body;

  // Validation
  if (!serviceId || !scheduledAt || !location || !contactInfo) {
    return res.status(400).json({
      success: false,
      message: 'Service, scheduled time, location, and contact info are required'
    });
  }

  // Validate service exists and is active
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Service not found or no longer available'
    });
  }

  // Validate scheduled time is in the future
  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Scheduled time must be in the future'
    });
  }

  // Validate location has required fields
  if (!location.address || !location.city || !location.state) {
    return res.status(400).json({
      success: false,
      message: 'Location must include address, city, and state'
    });
  }

  // Validate contact info
  if (!contactInfo.phone) {
    return res.status(400).json({
      success: false,
      message: 'Contact phone number is required'
    });
  }

  // Create booking
  const bookingData = {
    user: req.user._id,
    service: serviceId,
    scheduledAt: scheduledDate,
    location,
    vehicleInfo: vehicleInfo || {},
    contactInfo,
    problemDescription: problemDescription?.trim(),
    urgencyLevel,
    estimatedCost: service.price,
    status: 'pending'
  };

  const booking = new Booking(bookingData);
  await booking.save();

  // Populate related data
  await booking.populate([
    { path: 'service', select: 'title category price durationMinutes' },
    { path: 'user', select: 'name email phone' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking
    }
  });
}));

/**
 * GET /api/bookings
 * Get user's bookings (Customer) or assigned bookings (Mechanic)
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, startDate, endDate } = req.query;
  
  let query = {};
  
  // Build query based on user role
  if (req.user.role === 'customer') {
    query.user = req.user._id;
  } else if (req.user.role === 'mechanic') {
    query.mechanic = req.user._id;
  } else if (req.user.role === 'admin') {
    // Admin can see all bookings - no additional filter
  }

  // Apply filters
  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.scheduledAt = {};
    if (startDate) query.scheduledAt.$gte = new Date(startDate);
    if (endDate) query.scheduledAt.$lte = new Date(endDate);
  }

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [bookings, totalBookings] = await Promise.all([
    Booking.find(query)
      .populate('service', 'title category price durationMinutes')
      .populate('user', 'name email phone')
      .populate('mechanic', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Booking.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalBookings / parseInt(limit));

  res.status(200).json({
    success: true,
    message: 'Bookings retrieved successfully',
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    }
  });
}));

/**
 * GET /api/bookings/pending
 * Get pending bookings for assignment (Mechanic/Admin only)
 */
router.get('/pending', authenticate, mechanicOrAdmin, asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const bookings = await Booking.find({ 
    status: 'pending',
    scheduledAt: { $gte: new Date() } // Only future bookings
  })
    .populate('service', 'title category price durationMinutes')
    .populate('user', 'name email phone')
    .sort({ urgencyLevel: -1, scheduledAt: 1 }) // Urgent first, then by time
    .limit(parseInt(limit))
    .lean();

  res.status(200).json({
    success: true,
    message: 'Pending bookings retrieved successfully',
    data: {
      bookings,
      count: bookings.length
    }
  });
}));

/**
 * GET /api/bookings/:id
 * Get booking by ID
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate('service', 'title category price durationMinutes features')
    .populate('user', 'name email phone')
    .populate('mechanic', 'name email phone')
    .populate('notes.author', 'name role')
    .lean();

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check access permissions
  const hasAccess = req.user.role === 'admin' ||
                   booking.user._id.toString() === req.user._id.toString() ||
                   (booking.mechanic && booking.mechanic._id.toString() === req.user._id.toString());

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own bookings.'
    });
  }

  // Filter notes based on user role (hide internal notes from customers)
  if (req.user.role === 'customer') {
    booking.notes = booking.notes.filter(note => !note.isInternal);
  }

  res.status(200).json({
    success: true,
    message: 'Booking retrieved successfully',
    data: {
      booking
    }
  });
}));

/**
 * PUT /api/bookings/:id/status
 * Update booking status (Mechanic/Admin only)
 */
router.put('/:id/status', authenticate, mechanicOrAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  const validStatuses = ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'no-show'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
    });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if mechanic can update this booking
  if (req.user.role === 'mechanic') {
    // Mechanic can accept pending bookings or update their assigned bookings
    if (booking.status === 'pending' && status === 'accepted') {
      // Assign mechanic to booking
      booking.mechanic = req.user._id;
    } else if (booking.mechanic && booking.mechanic.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update bookings assigned to you'
      });
    }
  }

  // Update status with validation
  try {
    await booking.updateStatus(status, req.user._id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Add note if provided
  if (notes) {
    await booking.addNote(req.user._id, notes, false);
  }

  // Populate for response
  await booking.populate([
    { path: 'service', select: 'title category price durationMinutes' },
    { path: 'user', select: 'name email phone' },
    { path: 'mechanic', select: 'name email phone' }
  ]);

  res.status(200).json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: {
      booking
    }
  });
}));

/**
 * POST /api/bookings/:id/notes
 * Add note to booking
 */
router.post('/:id/notes', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, isInternal = false } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Note message is required'
    });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check access permissions
  const hasAccess = req.user.role === 'admin' ||
                   booking.user.toString() === req.user._id.toString() ||
                   (booking.mechanic && booking.mechanic.toString() === req.user._id.toString());

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only add notes to your own bookings.'
    });
  }

  // Only mechanics and admins can add internal notes
  const noteIsInternal = isInternal && ['mechanic', 'admin'].includes(req.user.role);

  await booking.addNote(req.user._id, message.trim(), noteIsInternal);

  res.status(201).json({
    success: true,
    message: 'Note added successfully'
  });
}));

/**
 * PUT /api/bookings/:id
 * Update booking details (Customer only, before acceptance)
 */
router.put('/:id', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check ownership
  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own bookings'
    });
  }

  // Only allow updates for pending bookings
  if (booking.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Can only update pending bookings'
    });
  }

  const allowedUpdates = [
    'scheduledAt', 'location', 'vehicleInfo', 'contactInfo', 
    'problemDescription', 'urgencyLevel'
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

  // Validate scheduled time if being updated
  if (updates.scheduledAt) {
    const scheduledDate = new Date(updates.scheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate([
    { path: 'service', select: 'title category price durationMinutes' },
    { path: 'user', select: 'name email phone' },
    { path: 'mechanic', select: 'name email phone' }
  ]);

  res.status(200).json({
    success: true,
    message: 'Booking updated successfully',
    data: {
      booking: updatedBooking
    }
  });
}));

/**
 * GET /api/bookings/stats
 * Get booking statistics (Admin only)
 */
router.get('/admin/stats', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateRange = {};
  if (startDate) dateRange.start = startDate;
  if (endDate) dateRange.end = endDate;

  const stats = await Booking.getBookingStats(dateRange);
  
  // Additional stats
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  
  // Recent bookings (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentBookings = await Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  res.status(200).json({
    success: true,
    message: 'Booking statistics retrieved successfully',
    data: {
      overview: {
        totalBookings,
        pendingBookings,
        completedBookings,
        recentBookings
      },
      statusBreakdown: stats,
      dateRange,
      generatedAt: new Date().toISOString()
    }
  });
}));

export default router;