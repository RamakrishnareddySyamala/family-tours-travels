import React from 'react';
import { Car, Phone, MessageSquare, Mail, MapPin, Heart } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppLink } from '../constants/config';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-400 text-sm border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 font-bold">
                <Car className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {BUSINESS_CONFIG.name}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              {BUSINESS_CONFIG.subTagline}
            </p>
            <div className="inline-block px-3 py-1 rounded bg-navy-900 border border-gold-500/30 text-gold-400 text-xs font-semibold">
              Dedicated Chauffeur Car Services • {BUSINESS_CONFIG.vehicleName}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-gold-400 transition-colors">Our Services</a></li>
              <li><a href="#vehicle" className="hover:text-gold-400 transition-colors">Suzuki Ertiga Showcase</a></li>
              <li><a href="#packages" className="hover:text-gold-400 transition-colors">Tour Packages</a></li>
              <li><a href="#why-us" className="hover:text-gold-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#reviews" className="hover:text-gold-400 transition-colors">Customer Reviews</a></li>
              <li><a href="#booking" className="hover:text-gold-400 transition-colors">Book / Enquiry</a></li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Summary</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Call: <strong className="text-white">{BUSINESS_CONFIG.phone}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: <strong className="text-white">{BUSINESS_CONFIG.whatsapp}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Email: <strong className="text-white">{BUSINESS_CONFIG.email}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Location: <strong className="text-white">{BUSINESS_CONFIG.location}</strong></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {year} {BUSINESS_CONFIG.name}. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Car with Driver Services</span>
            <span>•</span>
            <span className="text-slate-400">{BUSINESS_CONFIG.vehicleName}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
