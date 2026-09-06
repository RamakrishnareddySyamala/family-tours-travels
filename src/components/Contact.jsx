import React from 'react';
import {
  BUSINESS_CONFIG,
} from '../constants/config';

import useSettings from '../hooks/useSettings';

import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Navigation,
} from 'lucide-react';

const Contact = () => {

  const { settings } = useSettings();

  // =====================================================
  // SETTINGS WITH FALLBACK
  // =====================================================

  const phone =
    settings?.phoneNumber ||
    BUSINESS_CONFIG.phone;

  const whatsapp =
    settings?.whatsappNumber ||
    BUSINESS_CONFIG.whatsapp;

  const email =
    settings?.email ||
    BUSINESS_CONFIG.email;

  const location =
    settings?.address
      ? [
          settings.address,
          settings.city,
          settings.state,
          settings.pincode,
        ]
          .filter(Boolean)
          .join(', ')
      : BUSINESS_CONFIG.location;

  // =====================================================
  // WHATSAPP LINK
  // =====================================================

  const cleanWhatsappNumber =
    whatsapp?.replace(/\D/g, '');

  const whatsappLink = cleanWhatsappNumber
    ? `https://wa.me/91${cleanWhatsappNumber}`
    : '#';

  // =====================================================
  // GOOGLE MAPS LINK
  // =====================================================

  const mapsLink =
    `https://maps.google.com/?q=${encodeURIComponent(
      location
    )}`;

  return (

    <section
      id="contact"
      className="py-20 bg-white border-t border-slate-200 relative"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">

          <span className="px-3.5 py-1.5 rounded-full bg-navy-100 border border-navy-200 text-navy-800 text-xs font-bold uppercase tracking-wider">
            Direct Touchpoints
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Get in Touch
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Reach out to Family Tours & Travels via Call or WhatsApp for swift travel bookings and car enquiries.
          </p>

        </div>

        {/* =====================================================
            CONTACT CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* =====================================================
              PHONE
          ===================================================== */}

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle hover:border-gold-400 transition-all flex flex-col justify-between space-y-4">

            <div className="space-y-3">

              <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center">

                <Phone className="w-6 h-6" />

              </div>

              <div>

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phone Call
                </h3>

                <p className="text-base font-bold text-navy-900 mt-1">
                  {phone}
                </p>

              </div>

            </div>

            <a
              href={`tel:${phone}`}
              className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs text-center transition-colors block"
            >
              Call Now
            </a>

          </div>

          {/* =====================================================
              WHATSAPP
          ===================================================== */}

          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-subtle hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4">

            <div className="space-y-3">

              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">

                <MessageSquare className="w-6 h-6" />

              </div>

              <div>

                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  WhatsApp Chat
                </h3>

                <p className="text-base font-bold text-emerald-950 mt-1">
                  {whatsapp}
                </p>

              </div>

            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-colors block"
            >
              WhatsApp
            </a>

          </div>

          {/* =====================================================
              EMAIL
          ===================================================== */}

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle hover:border-gold-400 transition-all flex flex-col justify-between space-y-4">

            <div className="space-y-3">

              <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center">

                <Mail className="w-6 h-6" />

              </div>

              <div>

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email Inquiry
                </h3>

                <p className="text-base font-bold text-navy-900 mt-1 break-all">
                  {email}
                </p>

              </div>

            </div>

            <a
              href={`mailto:${email}`}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs text-center transition-colors block"
            >
              Send Email
            </a>

          </div>

          {/* =====================================================
              LOCATION
          ===================================================== */}

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle hover:border-gold-400 transition-all flex flex-col justify-between space-y-4">

            <div className="space-y-3">

              <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center">

                <MapPin className="w-6 h-6" />

              </div>

              <div>

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Business Location
                </h3>

                <p className="text-base font-bold text-navy-900 mt-1">
                  {location}
                </p>

              </div>

            </div>

            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
            >

              <Navigation className="w-3.5 h-3.5" />

              <span>
                Get Directions
              </span>

            </a>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Contact;