/**
 * AUTOAID 360 - API Configuration
 * Axios instance with interceptors for authentication and error handling
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('autoaid_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('autoaid_token');
      localStorage.removeItem('autoaid_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/me'),
};

// Services API calls
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

// Bookings API calls
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings'),
  getMechanicBookings: () => api.get('/bookings/mechanic'),
  getAllBookings: () => api.get('/bookings/admin'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// Users API calls (Admin only)
export const usersAPI = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;