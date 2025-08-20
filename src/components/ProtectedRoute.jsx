/**
 * AUTOAID 360 - Protected Route Component
 * Handles route protection based on authentication and role
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireRole = null,
  fallback = '/login' 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Redirect to home if user is authenticated but accessing login/signup
  if (!requireAuth && isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access
  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn-hero"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;