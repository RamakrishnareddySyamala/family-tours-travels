import React, { useEffect, useState } from 'react';
import {
  Car,
  Menu,
  X,
  Phone,
  MessageSquare,
  LogIn
} from 'lucide-react';

import { Link } from 'react-router-dom';

import {
  BUSINESS_CONFIG,
  getWhatsAppLink
} from '../constants/config';

import useSettings from '../hooks/useSettings';

const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { settings } = useSettings();

  // =====================================================
  // DATABASE SETTINGS WITH FALLBACK
  // =====================================================

  const companyName =
    settings?.companyName || BUSINESS_CONFIG.name;

  const phoneNumber =
    settings?.phoneNumber || BUSINESS_CONFIG.phone || '';

  const whatsappNumber =
    settings?.whatsappNumber ||
    BUSINESS_CONFIG.whatsapp ||
    BUSINESS_CONFIG.phone ||
    '';

  const onlineBooking =
    settings?.onlineBooking ?? true;

  const whatsappBooking =
    settings?.whatsappBooking ?? true;

  const callBooking =
    settings?.callBooking ?? true;

  // =====================================================
  // WHATSAPP LINK
  // =====================================================

  const cleanWhatsAppNumber =
    String(whatsappNumber).replace(/\D/g, '');

  const whatsappLink = cleanWhatsAppNumber
    ? `https://wa.me/91${cleanWhatsAppNumber}`
    : getWhatsAppLink();

  // =====================================================
  // SCROLL EFFECT
  // =====================================================

  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, []);

  // =====================================================
  // NAVIGATION LINKS
  // =====================================================

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Our Car', href: '#vehicle' },
    { name: 'Tour Packages', href: '#packages' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">

      {/* =================================================
          TOP CONTACT BAR
      ================================================= */}

      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-navy-800/50">

        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">

          {/* Service Information */}

          <div className="flex items-center space-x-2">

            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="font-medium text-slate-200">
              Car-With-Driver Travel Services
            </span>

            <span className="hidden sm:inline text-slate-500">
              •
            </span>

            <span className="hidden sm:inline text-gold-400 font-semibold">
              {BUSINESS_CONFIG.vehicleName} Available
            </span>

          </div>

          {/* Contact Buttons */}

          <div className="flex items-center space-x-4 text-xs">

            {/* Phone */}

            {callBooking && phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-1 hover:text-gold-400 transition-colors"
              >

                <Phone className="w-3.5 h-3.5 text-gold-400" />

                <span>
                  {phoneNumber}
                </span>

              </a>
            )}

            {/* WhatsApp */}

            {whatsappBooking && whatsappNumber && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >

                <MessageSquare className="w-3.5 h-3.5" />

                <span>
                  WhatsApp
                </span>

              </a>
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-lg py-3'
            : 'bg-navy-900/95 backdrop-blur-md py-4 border-b border-slate-800'
        }`}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between">

            {/* =================================================
                BRAND
            ================================================= */}

            <a
              href="#home"
              className="flex items-center space-x-3 group"
            >

              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">

                <Car className="w-6 h-6 text-navy-950 stroke-[2.2]" />

              </div>

              <div className="flex flex-col">

                <span className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  {companyName}
                </span>

                <span className="text-[10px] tracking-wider uppercase text-gold-400 font-semibold">
                  Car with Driver Services
                </span>

              </div>

            </a>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden lg:flex items-center space-x-7">

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-200 hover:text-gold-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-400 hover:after:w-full after:transition-all"
                >
                  {link.name}
                </a>
              ))}

            </div>

            {/* =================================================
                DESKTOP ACTIONS
            ================================================= */}

            <div className="hidden sm:flex items-center space-x-3">

              {/* Login */}

              <Link
  to="/admin/login"
  className="px-4 py-2.5 rounded-xl border border-gold-400/50 text-gold-400 hover:bg-gold-400 hover:text-navy-950 font-semibold text-sm transition-all flex items-center gap-2"
>

                <LogIn className="w-4 h-4" />

                <span>
                  Login
                </span>

              </Link>

              {/* Book Now */}

              {onlineBooking && (
                <a
                  href="#booking"
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm shadow-md hover:shadow-glow transition-all transform active:scale-95 flex items-center gap-2"
                >

                  <span>
                    Book Now
                  </span>

                </a>
              )}

            </div>

            {/* =================================================
                MOBILE BUTTONS
            ================================================= */}

            <div className="lg:hidden flex items-center space-x-2">

              {onlineBooking && (
                <a
                  href="#booking"
                  className="px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-bold text-xs"
                >
                  Book
                </a>
              )}

              <button
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
                type="button"
                className="p-2 rounded-lg bg-navy-800 text-slate-200 hover:text-white hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label="Toggle Navigation Menu"
              >

                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}

              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenuOpen && (
          <div className="lg:hidden bg-navy-950/98 backdrop-blur-xl border-b border-navy-800 px-4 pt-3 pb-6 space-y-3 transition-all animate-fadeIn">

            <div className="flex flex-col space-y-2 pt-2">

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="text-base font-medium text-slate-200 hover:text-gold-400 hover:bg-navy-900/60 px-3 py-2 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}

            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div className="pt-3 border-t border-navy-800/80 flex flex-col space-y-2">

              {/* Login */}

              <Link
                to="/admin/login"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="w-full text-center py-3 rounded-xl border border-gold-400/50 text-gold-400 hover:bg-gold-400 hover:text-navy-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >

                <LogIn className="w-4 h-4" />

                <span>
                  Login
                </span>

              </Link>

              {/* Booking */}

              {onlineBooking && (
                <a
                  href="#booking"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="w-full text-center py-3 rounded-xl bg-gold-500 text-navy-950 font-bold text-sm shadow-md"
                >
                  Book Your Journey
                </a>
              )}

              {/* WhatsApp */}

              {whatsappBooking && whatsappNumber && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold text-sm flex items-center justify-center gap-2"
                >

                  <MessageSquare className="w-4 h-4" />

                  <span>
                    WhatsApp Enquiry
                  </span>

                </a>
              )}

              {/* Call */}

              {callBooking && phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2"
                >

                  <Phone className="w-4 h-4" />

                  <span>
                    Call Now
                  </span>

                </a>
              )}

            </div>

          </div>
        )}

      </nav>

    </header>
  );
};

export default Navbar;