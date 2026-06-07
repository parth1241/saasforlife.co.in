import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const handleClick = () => {
    // Replace with your real corporate WhatsApp Business number (including country code)
    const phone = '917355802729';
    const text = encodeURIComponent('Hi! I am visiting saasforlife.co.in and have a question about your software services.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
      aria-label="Contact support on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:hidden" />
      <FaWhatsapp className="relative z-10" />
    </button>
  );
}
