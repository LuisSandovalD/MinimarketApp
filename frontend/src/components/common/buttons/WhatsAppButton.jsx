import React from 'react';
import { Send, Smartphone } from 'lucide-react';

// El componente recibe el número y el mensaje
export default function WhatsAppButton({ phoneNumber, message, customerName }) {
  
  const cleanedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');

  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md"
    >
      <Send size={18} />
      Enviar WhatsApp a {customerName}
    </a>
  );
}