/**
 * AUTOAID 360 - Floating WhatsApp Button
 * Quick access to WhatsApp support
 */

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    // Replace with actual WhatsApp business number
    const phoneNumber = '+1234567890';
    const message = 'Hi! I need roadside assistance through AUTOAID 360.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-float group"
      aria-label="Contact us on WhatsApp"
      title="Get instant help on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
    </button>
  );
};

export default WhatsAppFloat;