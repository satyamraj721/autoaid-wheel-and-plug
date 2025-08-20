/**
 * AUTOAID 360 - Service Card Component
 * Displays individual service with booking functionality
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Zap, Car, Shield, Wrench } from 'lucide-react';
import dayjs from 'dayjs';

const ServiceCard = ({ service, onBook, isLoading = false }) => {
  const {
    id,
    title,
    description,
    price,
    durationMinutes,
    category = 'roadside',
    featured = false,
    available = true
  } = service;

  // Get appropriate icon based on service category
  const getServiceIcon = (category) => {
    switch (category) {
      case 'ev':
        return <Zap className="h-5 w-5 text-secondary" />;
      case 'repair':
        return <Wrench className="h-5 w-5 text-primary" />;
      case 'protection':
        return <Shield className="h-5 w-5 text-warning" />;
      default:
        return <Car className="h-5 w-5 text-primary" />;
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className={`card-service ${featured ? 'ring-2 ring-primary' : ''} ${!available ? 'opacity-60' : ''}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getServiceIcon(category)}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {featured && (
              <Badge variant="secondary" className="text-xs">
                Popular
              </Badge>
            )}
            {!available && (
              <Badge variant="destructive" className="text-xs">
                Unavailable
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>ETA: {formatDuration(durationMinutes)}</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>{formatPrice(price)}</span>
          </div>
        </div>

        {category === 'ev' && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-secondary text-sm">
              <Zap className="h-4 w-4" />
              <span className="font-medium">EV Specialist Service</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Eco-friendly mobile charging and battery solutions
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onBook(service)}
          disabled={!available || isLoading}
          className={`w-full transition-smooth ${
            category === 'ev' 
              ? 'bg-secondary hover:bg-secondary-hover' 
              : featured 
                ? 'btn-hero' 
                : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Booking...
            </>
          ) : available ? (
            `Book ${title}`
          ) : (
            'Currently Unavailable'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;