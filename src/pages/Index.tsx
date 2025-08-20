/**
 * AUTOAID 360 - Index Page (Redirects to Home)
 * This file is kept for compatibility but redirects to the main Home page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
