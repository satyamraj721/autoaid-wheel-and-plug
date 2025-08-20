/**
 * AUTOAID 360 - Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/api';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('autoaid_token');
      const savedUser = localStorage.getItem('autoaid_user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend
          // const response = await authAPI.getProfile();
          // setUser(response.data.user);
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('autoaid_token');
          localStorage.removeItem('autoaid_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API when backend is ready
      const mockResponse = {
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: '1',
            name: 'John Doe',
            email: email,
            role: email.includes('admin') ? 'admin' : email.includes('mechanic') ? 'mechanic' : 'customer',
            createdAt: new Date().toISOString(),
          }
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Uncomment when backend is ready:
      // const response = await authAPI.login({ email, password });
      const response = mockResponse;

      const { token, user: userData } = response.data;
      
      localStorage.setItem('autoaid_token', token);
      localStorage.setItem('autoaid_user', JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Welcome to AUTOAID 360!",
        description: `Logged in as ${userData.name}`,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API when backend is ready
      const mockResponse = {
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            role: 'customer',
            createdAt: new Date().toISOString(),
          }
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Uncomment when backend is ready:
      // const response = await authAPI.signup(userData);
      const response = mockResponse;

      const { token, user: newUser } = response.data;

      localStorage.setItem('autoaid_token', token);
      localStorage.setItem('autoaid_user', JSON.stringify(newUser));
      setUser(newUser);

      toast({
        title: "Account Created!",
        description: `Welcome to AUTOAID 360, ${newUser.name}!`,
      });

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed", 
        description: error.response?.data?.message || "Failed to create account",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API
      // await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('autoaid_token');
      localStorage.removeItem('autoaid_user');
      setUser(null);
      toast({
        title: "Logged Out",
        description: "See you next time!",
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMechanic: user?.role === 'mechanic',
    isCustomer: user?.role === 'customer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};