/**
 * AUTOAID 360 - Services Page
 * Browse and book available services
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ServiceCard from '../components/ServiceCard';
import { Search, Filter, MapPin, Clock, Star, Zap, Car, Shield, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock services data - replace with API call
  const mockServices = [
    // Roadside Assistance
    {
      id: '1',
      title: 'Emergency Towing',
      description: 'Professional towing service to get your vehicle to safety or your preferred repair shop.',
      price: 89.99,
      durationMinutes: 30,
      category: 'roadside',
      featured: true,
      available: true
    },
    {
      id: '2',
      title: 'Flat Tire Repair',
      description: 'On-site tire change or repair service. We carry most common tire sizes.',
      price: 45.99,
      durationMinutes: 20,
      category: 'roadside',
      featured: false,
      available: true
    },
    {
      id: '3',
      title: 'Jump Start Service',
      description: 'Battery jump start service to get you back on the road quickly.',
      price: 35.99,
      durationMinutes: 15,
      category: 'roadside',
      featured: false,
      available: true
    },
    {
      id: '4',
      title: 'Lockout Assistance',
      description: 'Professional lockout service to safely unlock your vehicle without damage.',
      price: 65.99,
      durationMinutes: 25,
      category: 'roadside',
      featured: false,
      available: true
    },
    // EV Services
    {
      id: '5',
      title: 'Mobile EV Charging',
      description: 'Emergency mobile charging service for electric vehicles. Get enough charge to reach the nearest station.',
      price: 79.99,
      durationMinutes: 45,
      category: 'ev',
      featured: true,
      available: true
    },
    {
      id: '6',
      title: 'EV Battery Delivery',
      description: 'Emergency battery pack delivery and installation for compatible electric vehicles.',
      price: 149.99,
      durationMinutes: 60,
      category: 'ev',
      featured: false,
      available: true
    },
    {
      id: '7',
      title: 'EV Diagnostics',
      description: 'Professional EV system diagnostics and troubleshooting with specialized equipment.',
      price: 99.99,
      durationMinutes: 40,
      category: 'ev',
      featured: false,
      available: true
    },
    // Mobile Repairs
    {
      id: '8',
      title: 'Mobile Oil Change',
      description: 'Complete oil change service performed at your location with premium oil and filters.',
      price: 59.99,
      durationMinutes: 30,
      category: 'repair',
      featured: false,
      available: true
    },
    {
      id: '9',
      title: 'Mobile Brake Inspection',
      description: 'Comprehensive brake system inspection and minor repairs on-site.',
      price: 75.99,
      durationMinutes: 45,
      category: 'repair',
      featured: false,
      available: true
    },
    // Protection Services
    {
      id: '10',
      title: 'Accident Response',
      description: 'Comprehensive accident response including towing, documentation, and insurance coordination.',
      price: 199.99,
      durationMinutes: 90,
      category: 'protection',
      featured: true,
      available: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadServices = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServices(mockServices);
      setIsLoading(false);
    };

    loadServices();
  }, []);

  useEffect(() => {
    // Filter services based on search and category
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const handleBookService = async (service) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book services.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: '/services' } } });
      return;
    }

    setBookingLoading(service.id);

    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Service Booked Successfully!",
        description: `${service.title} has been scheduled. You'll receive a confirmation shortly.`,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(null);
    }
  };

  const categories = [
    { id: 'all', label: 'All Services', icon: <Star className="h-4 w-4" /> },
    { id: 'roadside', label: 'Roadside', icon: <Car className="h-4 w-4" /> },
    { id: 'ev', label: 'EV Services', icon: <Zap className="h-4 w-4" /> },
    { id: 'repair', label: 'Mobile Repairs', icon: <Wrench className="h-4 w-4" /> },
    { id: 'protection', label: 'Protection', icon: <Shield className="h-4 w-4" /> }
  ];

  const emergencyServices = filteredServices.filter(s => s.featured);
  const regularServices = filteredServices.filter(s => !s.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-automotive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Book Your Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional roadside assistance, EV services, and mobile repairs available 24/7.
            Get help when and where you need it most.
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-destructive bg-destructive/10">
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>Emergency?</strong> Call 1-800-AUTOAID for immediate assistance.
            </span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => window.open('tel:1-800-AUTOAID', '_self')}
            >
              Call Now
            </Button>
          </AlertDescription>
        </Alert>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Available nationwide with GPS tracking
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center space-x-2"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold">No services found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filters.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Services */}
        {emergencyServices.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Badge variant="destructive" className="animate-pulse">
                Emergency
              </Badge>
              <h2 className="text-2xl font-bold text-foreground">
                Most Requested Services
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookService}
                  isLoading={bookingLoading === service.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Services */}
        {regularServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              All Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookService}
                  isLoading={bookingLoading === service.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 py-12 border-t border-border">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Need Help Choosing?
            </h3>
            <p className="text-muted-foreground">
              Our support team is available 24/7 to help you find the right service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => window.open('tel:1-800-AUTOAID', '_self')}
              >
                Call Support
              </Button>
              <Button className="btn-hero">
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;