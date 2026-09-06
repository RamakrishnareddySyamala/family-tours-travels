import React, { useState } from 'react';
import { VEHICLE_DETAILS } from '../constants/config';
import { UserCheck, Users, Wind, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const iconMap = {
  UserCheck,
  Users,
  Wind,
  Sparkles,
};

const Vehicle = () => {
  const [activeTab, setActiveTab] = useState('exterior');

  return (
    <section id="vehicle" className="py-20 bg-white border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-navy-100 border border-navy-200 text-navy-800 text-xs font-bold uppercase tracking-wider">
            Featured Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            {VEHICLE_DETAILS.headline}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Enjoy premium seating, air conditioning, ample luggage room, and smooth highway performance with our experienced driver service.
          </p>
        </div>

        {/* Vehicle Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Photo Tabs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900">
              <img
                src={activeTab === 'exterior' ? VEHICLE_DETAILS.image : VEHICLE_DETAILS.interiorImage}
                alt={`${VEHICLE_DETAILS.name} ${activeTab}`}
                className="w-full h-[340px] sm:h-[420px] object-cover object-center transition-all duration-500"
              />
              
              {/* Tab Selector Pill overlay */}
              <div className="absolute top-4 right-4 bg-navy-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-700 flex space-x-1">
                <button
                  onClick={() => setActiveTab('exterior')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'exterior' ? 'bg-gold-500 text-navy-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Exterior
                </button>
                <button
                  onClick={() => setActiveTab('interior')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'interior' ? 'bg-gold-500 text-navy-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Interior & Seats
                </button>
              </div>

              {/* Chauffeur Service Badge */}
              <div className="absolute bottom-4 left-4 bg-navy-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gold-500/40 text-gold-400 text-xs font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Dedicated Chauffeur Service Included</span>
              </div>
            </div>

            {/* Note on Self-Drive */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                <strong>Car with Driver Service:</strong> Family Tours & Travels provides car services strictly with professional drivers. We do not provide self-drive rentals.
              </p>
            </div>
          </div>

          {/* Right Column: Features & Placeholders Grid */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
                Vehicle Overview
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                {VEHICLE_DETAILS.name}
              </h3>
              <p className="text-sm text-slate-600">
                The perfect 7-seater MPV for family road trips, outstation tours, local sightseeing, and comfortable airport travel.
              </p>
            </div>

            {/* Feature Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VEHICLE_DETAILS.features.map((item, idx) => {
                const IconComp = iconMap[item.icon] || UserCheck;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-gold-300 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Spec Placeholders Box */}
            <div className="bg-navy-900 text-white rounded-2xl p-5 border border-navy-800 space-y-3">
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider border-b border-navy-800 pb-2">
                Vehicle Specifications (Configurable)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {VEHICLE_DETAILS.specsPlaceholder.map((spec, idx) => (
                  <div key={idx} className="bg-navy-950/60 p-2.5 rounded-lg border border-navy-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{spec.label}</span>
                    <span className="text-gold-300 font-mono font-bold mt-0.5 block">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enquire CTA Button */}
            <div className="pt-2">
              <a
                href="#booking"
                className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm shadow-md hover:shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Enquire About Suzuki Ertiga</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Vehicle;
