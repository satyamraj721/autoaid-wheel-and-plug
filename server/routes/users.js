/**
 * AUTOAID 360 - User Management Routes
 * User profile, listing, and management endpoints
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user's profile
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  // User is already attached by auth middleware
  const user = await User.findById(req.user._id)
    .select('-passwordHash')
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user
    }
  });
}));

/**
 * PUT /api/users/me
 * Update current user's profile
 */
router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allowedUpdates = ['name', 'phone', 'location'];
  const updates = {};

  // Filter allowed updates
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

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { 
      new: true, 
      runValidators: true 
    }
  ).select('-passwordHash');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
}));

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get('/', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    role,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isActive
  } = req.query;

  // Build query
  const query = {};
  
  if (role && ['customer', 'mechanic', 'admin'].includes(role)) {
    query.role = role;
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [users, totalUsers] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query)
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalUsers / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    }
  });
}));

/**
 * GET /api/users/:id
 * Get user by ID (Admin only)
 */
router.get('/:id', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select('-passwordHash')
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: {
      user
    }
  });
}));

/**
 * PATCH /api/users/:id/role
 * Update user role (Admin only)
 */
router.patch('/:id/role', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['customer', 'mechanic', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Valid role is required (customer, mechanic, admin)'
    });
  }

  // Prevent admin from changing their own role
  if (id === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own role'
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: { role } },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user
    }
  });
}));

/**
 * PATCH /api/users/:id/status
 * Update user active status (Admin only)
 */
router.patch('/:id/status', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'isActive must be a boolean value'
    });
  }

  // Prevent admin from deactivating themselves
  if (id === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own status'
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: { isActive } },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      user
    }
  });
}));

/**
 * GET /api/users/stats
 * Get user statistics (Admin only)
 */
router.get('/admin/stats', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const stats = await User.getUserStats();
  
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = totalUsers - activeUsers;

  // Recent signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSignups = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  res.status(200).json({
    success: true,
    message: 'User statistics retrieved successfully',
    data: {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentSignups
      },
      roleDistribution: stats,
      generatedAt: new Date().toISOString()
    }
  });
}));

export default router;