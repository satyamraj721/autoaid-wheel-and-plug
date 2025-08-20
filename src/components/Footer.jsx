/**
 * AUTOAID 360 - Footer Component
 * Site footer with links, contact info, and social media
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, Clock, Zap, Car, Shield, Headphones } from 'lucide-react';
import logo from '@/assets/brand/autoaid360_logo.png';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="AUTOAID 360" className="h-10 w-10" />
              <span className="font-bold text-xl">AUTOAID 360</span>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-ready roadside assistance & EV mobility platform providing 24/7 emergency 
              services, repairs, and charging solutions.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">24/7 Emergency Service</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Car className="h-3 w-3" />
                <span>Emergency Towing</span>
              </li>
              <li className="flex items-center space-x-2">
                <Car className="h-3 w-3" />
                <span>Roadside Repairs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-3 w-3 text-secondary" />
                <span>EV Mobile Charging</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-3 w-3 text-secondary" />
                <span>Battery Delivery</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Accident Protection</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Book Service
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Emergency Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-foreground font-medium">1-800-AUTOAID</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">help@autoaid360.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Available nationwide<br />
                  GPS tracking enabled
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Live chat available</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 AUTOAID 360. All rights reserved. | Licensed & Insured Emergency Services
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/careers" className="hover:text-primary transition-colors">
              Careers
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;