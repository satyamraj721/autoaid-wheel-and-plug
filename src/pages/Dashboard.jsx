/**
 * AUTOAID 360 - Dashboard Page
 * User dashboard showing role-specific content
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign,
  Settings,
  Bell,
  Car,
  Zap,
  Wrench,
  Shield,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Dashboard = () => {
  const { user, isAdmin, isMechanic, isCustomer } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API calls
  const mockBookings = [
    {
      id: '1',
      service: 'Emergency Towing',
      status: 'confirmed',
      scheduledAt: dayjs().add(30, 'minutes').toISOString(),
      location: 'Interstate 95, Mile Marker 45',
      mechanic: 'Mike Johnson',
      price: 89.99,
      customerName: 'John Doe',
      customerPhone: '+1-555-0123'
    },
    {
      id: '2',
      service: 'Mobile EV Charging',
      status: 'completed',
      scheduledAt: dayjs().subtract(2, 'hours').toISOString(),
      location: 'Downtown Shopping Center',
      mechanic: 'Sarah Wilson',
      price: 79.99,
      customerName: 'Jane Smith',
      customerPhone: '+1-555-0124'
    },
    {
      id: '3',
      service: 'Flat Tire Repair',
      status: 'pending',
      scheduledAt: dayjs().add(1, 'hour').toISOString(),
      location: 'Oak Street & 5th Avenue',
      price: 45.99,
      customerName: 'Bob Wilson',
      customerPhone: '+1-555-0125'
    }
  ];

  const mockStats = {
    customer: {
      totalBookings: 8,
      activeBookings: 1,
      totalSpent: 459.93,
      memberSince: '2024-01-15'
    },
    mechanic: {
      totalJobs: 156,
      completedToday: 3,
      averageRating: 4.8,
      earnings: 2450.00
    },
    admin: {
      totalUsers: 1250,
      activeBookings: 45,
      revenue: 25600.00,
      satisfaction: 4.7
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter bookings based on user role
      let filteredBookings = mockBookings;
      if (isCustomer) {
        filteredBookings = mockBookings.filter(booking => booking.customerName === user.name);
      } else if (isMechanic) {
        filteredBookings = mockBookings.filter(booking => booking.mechanic === user.name);
      }
      
      setBookings(filteredBookings);
      setStats(mockStats);
      setIsLoading(false);
    };

    loadDashboardData();
  }, [user, isCustomer, isMechanic]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'default', className: 'status-pending', icon: <Clock className="h-3 w-3" /> },
      confirmed: { variant: 'default', className: 'status-confirmed', icon: <CheckCircle className="h-3 w-3" /> },
      completed: { variant: 'default', className: 'status-completed', icon: <CheckCircle className="h-3 w-3" /> },
      cancelled: { variant: 'default', className: 'status-cancelled', icon: <XCircle className="h-3 w-3" /> }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Customer Dashboard
  if (isCustomer) {
    return (
      <div className="min-h-screen bg-gradient-automotive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground">
                Manage your bookings and account settings
              </p>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.customer?.totalBookings}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-secondary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.customer?.activeBookings}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-warning" />
                  <div>
                    <div className="text-2xl font-bold">{formatPrice(stats.customer?.totalSpent)}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Member Since</div>
                    <div className="text-sm text-muted-foreground">
                      {dayjs(stats.customer?.memberSince).format('MMM YYYY')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Your Bookings
              </CardTitle>
              <CardDescription>
                Track your current and past service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Book your first service to get started with AUTOAID 360
                  </p>
                  <Button className="btn-hero">Book Service</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{booking.service}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{dayjs(booking.scheduledAt).format('MMM D, YYYY h:mm A')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatPrice(booking.price)}</span>
                        </div>
                      </div>
                      {booking.mechanic && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Technician: </span>
                          <span className="font-medium">{booking.mechanic}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mechanic Dashboard
  if (isMechanic) {
    return (
      <div className="min-h-screen bg-gradient-automotive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mechanic Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your assigned jobs and track performance
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Mechanic Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.mechanic?.totalJobs}</div>
                    <div className="text-sm text-muted-foreground">Total Jobs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-secondary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.mechanic?.completedToday}</div>
                    <div className="text-sm text-muted-foreground">Completed Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-warning" />
                  <div>
                    <div className="text-2xl font-bold">{stats.mechanic?.averageRating}★</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{formatPrice(stats.mechanic?.earnings)}</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Assigned Jobs
              </CardTitle>
              <CardDescription>
                Your current and upcoming service assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{booking.service}</h4>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                          <User className="h-4 w-4" />
                          <span>{booking.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          <span>{dayjs(booking.scheduledAt).format('MMM D, h:mm A')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatPrice(booking.price)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button size="sm" className="bg-secondary hover:bg-secondary-hover">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-automotive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage users, services, and platform analytics
              </p>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </Button>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.admin?.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-secondary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.admin?.activeBookings}</div>
                    <div className="text-sm text-muted-foreground">Active Bookings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-warning" />
                  <div>
                    <div className="text-2xl font-bold">{formatPrice(stats.admin?.revenue)}</div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stats.admin?.satisfaction}★</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">All Bookings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Platform Bookings</CardTitle>
                  <CardDescription>
                    Monitor and manage all service bookings across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBookings.map((booking) => (
                      <div key={booking.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{booking.service}</h4>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <div className="font-medium text-foreground">Customer</div>
                            <div>{booking.customerName}</div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Mechanic</div>
                            <div>{booking.mechanic || 'Unassigned'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Revenue</div>
                            <div>{formatPrice(booking.price)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage platform users and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      User management interface would be implemented here with full CRUD operations.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Service Management</CardTitle>
                  <CardDescription>
                    Manage available services, pricing, and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Service management interface would be implemented here with pricing controls.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>
                    Monitor platform performance and user engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Analytics dashboard with charts and metrics would be implemented here.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;