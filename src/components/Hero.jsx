import React from 'react';
import { Shield, UserCheck, Compass, ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { BUSINESS_CONFIG, VEHICLE_DETAILS, getWhatsAppLink } from '../constants/config';

const Hero = () => {
  return (
    <section id="home" className="relative pt-28 sm:pt-36 pb-16 lg:pb-24 bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-navy-800/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              <span>Dedicated Car with Driver Service • {BUSINESS_CONFIG.vehicleName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {BUSINESS_CONFIG.tagline}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {BUSINESS_CONFIG.subTagline}
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-navy-800/40 p-2.5 rounded-xl border border-slate-700/50">
                <UserCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="font-medium">Driver Included</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-navy-800/40 p-2.5 rounded-xl border border-slate-700/50">
                <Shield className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="font-medium">Family Safety</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-navy-800/40 p-2.5 rounded-xl border border-slate-700/50 col-span-2 sm:col-span-1">
                <Compass className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="font-medium">Local & Outstation</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#booking"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 font-bold text-base shadow-lg hover:shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group"
              >
                <span>Book Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30 font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Non-self-drive Clarification Note */}
            <p className="text-xs text-slate-400 pt-2 flex items-center justify-center lg:justify-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
              <span>Chauffeur driven travel • No self-drive rental</span>
            </p>
          </div>

          {/* Right Column: High Quality Ertiga Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-navy-800/80 group">
              <img
                src={VEHICLE_DETAILS.image}
                alt="Suzuki Ertiga Car with Driver for Family Tours and Travels"
                className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Image Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>

              {/* Card Footer Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-gold-500 text-navy-950 font-bold text-xs uppercase tracking-wider">
                    Featured Vehicle
                  </span>
                  <span className="text-xs text-slate-300 bg-navy-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700">
                    7 Seater Air Conditioned
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Suzuki Ertiga (Car + Driver)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Clean, well-maintained AC car for local sightseeing, outstation round trips & airport pickup.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
