/**
 * AUTOAID 360 - Navigation Component
 * Main navigation bar with authentication and responsive design
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, Car, Zap } from 'lucide-react';
import logoHorizontal from '@/assets/brand/logo-horizontal.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logoHorizontal} 
              alt="AUTOAID 360" 
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span>Services</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[400px]">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Roadside Assistance</h4>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>• Emergency Towing</div>
                                <div>• Flat Tire Repair</div>
                                <div>• Jump Start Service</div>
                                <div>• Lockout Assistance</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium flex items-center">
                                <Zap className="h-4 w-4 mr-1" />
                                EV Services
                              </h4>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>• Mobile Charging</div>
                                <div>• Battery Delivery</div>
                                <div>• EV Diagnostics</div>
                                <div>• Charging Station Locator</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <Link 
                  to="/services" 
                  className={`hover:text-primary transition-colors ${
                    isActive('/services') ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  Book Service
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`hover:text-primary transition-colors ${
                    isActive('/dashboard') ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:inline">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile & Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/services" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Services
                </Link>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-hero">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/services"
                    className="block px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Service
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Signed in as {user?.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-destructive hover:bg-accent rounded-md"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/services"
                    className="block px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="btn-hero w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;