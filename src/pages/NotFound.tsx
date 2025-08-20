/**
 * AUTOAID 360 - 404 Not Found Page
 * Custom 404 page with AUTOAID 360 branding
 */

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Phone, Search } from "lucide-react";
import logo from '@/assets/brand/autoaid360_logo.png';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-automotive px-4">
      <Card className="max-w-md w-full text-center shadow-automotive">
        <CardHeader className="space-y-4">
          <img 
            src={logo} 
            alt="AUTOAID 360" 
            className="h-16 w-16 mx-auto"
          />
          <div>
            <CardTitle className="text-6xl font-bold text-primary mb-2">404</CardTitle>
            <CardDescription className="text-xl">
              Oops! We couldn't find that page
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            The page you're looking for might have been moved, deleted, or doesn't exist.
            But don't worry – our emergency services are always available!
          </p>
          
          <div className="flex flex-col space-y-3">
            <Link to="/">
              <Button className="btn-hero w-full">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
            
            <Link to="/services">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Browse Services
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Need emergency assistance?
            </p>
            <Button 
              variant="destructive"
              onClick={() => window.open('tel:1-800-AUTOAID', '_self')}
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call 1-800-AUTOAID
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
