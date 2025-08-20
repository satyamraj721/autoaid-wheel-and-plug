/**
 * AUTOAID 360 - Authentication Middleware
 * Handles JWT token verification and role-based access control
 */

import { verifyToken, extractToken } from '../utils/generateToken.js';
import User from '../models/User.js';

/**
 * Authentication middleware - verifies JWT token
 * Supports both Authorization header and httpOnly cookie
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Try to get token from Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader) {
      token = extractToken(authHeader);
    }

    // Fallback to httpOnly cookie (for future cookie-based auth)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found or inactive.'
      });
    }

    // Attach user and token info to request object
    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Handle specific JWT errors
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.'
      });
    }
    
    if (error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please log in again.'
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} allowedRoles - Roles that can access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Admin-only access middleware
 */
export const adminOnly = authorize('admin');

/**
 * Mechanic or Admin access middleware
 */
export const mechanicOrAdmin = authorize('mechanic', 'admin');

/**
 * Customer-only access middleware
 */
export const customerOnly = authorize('customer');

/**
 * Check if user owns the resource or is admin
 * @param {string} userField - Field name containing user ID (default: 'user')
 */
export const ownerOrAdmin = (userField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check resource ownership
    const resourceUserId = req.body[userField] || req.params[userField] || req.query[userField];
    
    if (!resourceUserId) {
      return res.status(400).json({
        success: false,
        message: `${userField} field is required.`
      });
    }

    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

/**
 * Optional authentication - allows both authenticated and anonymous users
 * But attaches user info if token is provided
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader && extractToken(authHeader));

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (user && user.isActive) {
        req.user = user;
        req.token = decoded;
      }
    }
    
    next(); // Continue regardless of auth status
  } catch (error) {
    // Silently continue without authentication for optional auth
    next();
  }
};