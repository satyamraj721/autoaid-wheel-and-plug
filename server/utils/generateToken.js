/**
 * AUTOAID 360 - JWT Token Generation Utility
 * Creates and validates JWT tokens for authentication
 */

import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} role - User's role (customer, mechanic, admin)
 * @returns {string} - Signed JWT token
 */
export const generateToken = (userId, role = 'customer') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000), // Issued at
    type: 'access' // Token type for future refresh token implementation
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'autoaid360',
    audience: 'autoaid360-users'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Generate refresh token (for future implementation)
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} - Signed refresh token
 */
export const generateRefreshToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  const payload = {
    userId,
    type: 'refresh'
  };

  const options = {
    expiresIn: '30d', // Refresh tokens last longer
    issuer: 'autoaid360',
    audience: 'autoaid360-users'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  try {
    const options = {
      issuer: 'autoaid360',
      audience: 'autoaid360-users'
    };

    return jwt.verify(token, process.env.JWT_SECRET, options);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
export const extractToken = (authHeader) => {
  if (!authHeader) return null;
  
  // Support both "Bearer token" and "token" formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return authHeader;
};

/**
 * Generate secure token for password reset, email verification, etc.
 * @param {number} length - Token length (default: 32)
 * @returns {string} - Random secure token
 */
export const generateSecureToken = (length = 32) => {
  const crypto = await import('crypto');
  return crypto.randomBytes(length).toString('hex');
};