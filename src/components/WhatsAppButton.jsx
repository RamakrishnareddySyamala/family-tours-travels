import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '../constants/config';

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-lg bg-navy-950 text-white text-xs font-semibold shadow-lg border border-navy-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Enquire on WhatsApp
      </span>

      {/* Pulsating Floating Action Button */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Family Tours & Travels on WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 animate-pulse-glow"
      >
        <MessageSquare className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
