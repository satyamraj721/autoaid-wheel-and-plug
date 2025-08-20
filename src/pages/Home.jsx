/**
 * AUTOAID 360 - Home Page
 * Landing page with hero section, services overview, and CTA
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Zap, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Star,
  CheckCircle,
  ArrowRight,
  Wrench,
  Battery,
  Users
} from 'lucide-react';
import logo from '@/assets/brand/autoaid360_logo.png';

const Home = () => {
  const services = [
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Emergency Roadside",
      description: "24/7 towing, flat tire repair, jump start, and lockout assistance",
      features: ["GPS tracking", "30min avg response", "Licensed mechanics"]
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: "EV Mobile Charging",
      description: "On-demand battery delivery and mobile charging for electric vehicles",
      features: ["All EV models", "Fast charging", "Eco-friendly"]
    },
    {
      icon: <Shield className="h-8 w-8 text-warning" />,
      title: "Accident Protection",
      description: "Comprehensive coverage and immediate response for accidents",
      features: ["Insurance help", "Legal support", "Tow to preferred shop"]
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Mobile Repairs",
      description: "On-site diagnostics and repairs by certified technicians",
      features: ["OBD diagnostics", "Minor repairs", "Parts delivery"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Customers Served", icon: <Users className="h-5 w-5" /> },
    { number: "15min", label: "Avg Response Time", icon: <Clock className="h-5 w-5" /> },
    { number: "24/7", label: "Emergency Support", icon: <Phone className="h-5 w-5" /> },
    { number: "4.9★", label: "Customer Rating", icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  AI-Ready Roadside Assistance
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Emergency Help
                  <br />
                  <span className="text-secondary">When You Need It</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  24/7 roadside assistance, EV charging, mobile repairs, and accident protection.
                  Get help in minutes, not hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/services">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 h-auto">
                    Book Emergency Service
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 h-auto"
                  onClick={() => window.open('tel:1-800-AUTOAID', '_self')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call 1-800-AUTOAID
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>GPS Tracked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>No Hidden Fees</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="AUTOAID 360 Logo" 
                  className="w-80 h-80 object-contain shadow-glow"
                />
                <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce">
                  Available 24/7!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Complete Roadside Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From traditional roadside assistance to cutting-edge EV support, 
              we've got every vehicle covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-service text-center">
                <CardHeader className="space-y-4">
                  <div className="flex justify-center">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button className="btn-hero">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-automotive">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready When You Need Us Most
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of drivers who trust AUTOAID 360 for reliable, 
            professional roadside assistance and EV support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="btn-hero">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="px-8 py-4 h-auto">
                Browse Services
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Nationwide Coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Licensed & Bonded</span>
            </div>
            <div className="flex items-center space-x-2">
              <Battery className="h-4 w-4" />
              <span>EV Certified</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;