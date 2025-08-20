/**
 * AUTOAID 360 - Login Page
 * User authentication with email/password
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Car, AlertCircle } from 'lucide-react';
import logo from '@/assets/brand/autoaid360_logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'customer@demo.com', role: 'Customer', description: 'Book services and track requests' },
    { email: 'mechanic@demo.com', role: 'Mechanic', description: 'Manage assigned service calls' },
    { email: 'admin@demo.com', role: 'Admin', description: 'Full platform management' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-automotive py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img 
            src={logo} 
            alt="AUTOAID 360" 
            className="mx-auto h-16 w-16"
          />
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your AUTOAID 360 account
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="flex items-center justify-between w-full text-sm">
              <Link 
                to="/forgot-password" 
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Car className="h-4 w-4 mr-2 text-primary" />
              Demo Accounts (for testing)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{account.role}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                  <div className="text-xs text-muted-foreground">{account.description}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ email: account.email, password: 'demo123' })}
                >
                  Use
                </Button>
              </div>
            ))}
            <div className="text-xs text-muted-foreground text-center">
              Password for all demo accounts: <code className="bg-muted px-1 rounded">demo123</code>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;