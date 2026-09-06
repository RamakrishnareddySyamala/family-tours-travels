import React from 'react';
import { TOUR_PACKAGES, getWhatsAppLink } from '../constants/config';
import { MapPin, Clock, Car, Check, ArrowRight, Info } from 'lucide-react';

const TourPackages = () => {
  return (
    <section id="packages" className="py-20 bg-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider">
            Custom Itineraries
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Explore Our Tour Packages
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Tailored travel packages featuring dedicated Suzuki Ertiga car-with-driver service. All destinations and prices are fully customizable.
          </p>
        </div>

        {/* Notice on Placeholders */}
        <div className="mb-10 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 text-blue-900 text-xs sm:text-sm">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span>
            <strong>Note for Business Owner:</strong> Destination names, durations, and pricing placeholders below can be updated instantly in `config.js` once confirmed.
          </span>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOUR_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-xl hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Header Banner */}
                <div className="bg-navy-900 text-white p-6 relative">
                  <div className="flex items-center justify-between text-xs text-gold-400 mb-2 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1 bg-navy-800 px-2 py-0.5 rounded border border-navy-700">
                      <Car className="w-3.5 h-3.5 text-gold-400" />
                      Driver Included
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                    {pkg.title}
                  </h3>
                  <div className="mt-3 inline-block bg-gold-500/20 text-gold-300 text-xs font-mono px-2.5 py-1 rounded border border-gold-500/30">
                    Est. Rate: {pkg.price}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block">
                      Package Includes:
                    </span>
                    <ul className="space-y-2">
                      {pkg.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <a
                  href={`#booking`}
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Enquire About Package</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={getWhatsAppLink(`Enquiry regarding Tour Package: ${pkg.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Ask on WhatsApp</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TourPackages;
