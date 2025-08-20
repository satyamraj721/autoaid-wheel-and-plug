/**
 * AUTOAID 360 - Authentication Routes
 * User registration, login, logout, and authentication endpoints
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user account
 */
router.post('/signup', asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = 'customer' } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Validate role
  const allowedRoles = ['customer', 'mechanic'];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Allowed roles: customer, mechanic'
    });
  }

  // Create new user
  const userData = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: password, // Will be hashed by pre-save middleware
    role,
    phone: phone?.trim(),
    isActive: true
  };

  const user = new User(userData);
  await user.save();

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  // Remove sensitive data
  const userResponse = user.toJSON();

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  });
}));

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Find user by email
  const user = await User.findByEmail(email);
  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  await user.updateLastLogin();

  // Generate JWT token
  const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '7d');
  const token = generateToken(user._id, user.role);

  // Set httpOnly cookie (optional - for cookie-based auth)
  if (process.env.USE_COOKIE_AUTH === 'true') {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
    };
    res.cookie('token', token, cookieOptions);
  }

  // Remove sensitive data
  const userResponse = user.toJSON();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token,
      expiresIn,
      authMethod: process.env.USE_COOKIE_AUTH === 'true' ? 'cookie' : 'bearer'
    }
  });
}));

/**
 * POST /api/auth/logout
 * Logout user and clear authentication
 */
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // Clear httpOnly cookie if using cookie-based auth
  if (process.env.USE_COOKIE_AUTH === 'true') {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  // In a more advanced implementation, you might:
  // 1. Add the token to a blacklist
  // 2. Store logout timestamp in database
  // 3. Invalidate refresh tokens

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
}));

/**
 * POST /api/auth/refresh
 * Refresh JWT token (for future implementation)
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  // This endpoint would handle refresh token logic
  // For now, return not implemented
  res.status(501).json({
    success: false,
    message: 'Token refresh not implemented yet'
  });
}));

/**
 * POST /api/auth/forgot-password
 * Request password reset (for future implementation)
 */
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  // Find user
  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists for security
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link'
    });
  }

  // TODO: Implement password reset logic
  // 1. Generate secure reset token
  // 2. Save token with expiration to database
  // 3. Send email with reset link
  
  res.status(200).json({
    success: true,
    message: 'Password reset functionality coming soon'
  });
}));

/**
 * GET /api/auth/verify
 * Verify JWT token validity
 */
router.get('/verify', authenticate, asyncHandler(async (req, res) => {
  // If middleware passes, token is valid
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      user: req.user,
      tokenInfo: {
        userId: req.token.userId,
        role: req.token.role,
        iat: new Date(req.token.iat * 1000),
        exp: new Date(req.token.exp * 1000)
      }
    }
  });
}));

export default router;