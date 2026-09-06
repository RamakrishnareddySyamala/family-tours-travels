import React from 'react';
import { WHY_CHOOSE_US } from '../constants/config';
import { ShieldCheck, Award, Clock, Heart } from 'lucide-react';

const iconMap = {
  ShieldCheck,
  Award,
  Clock,
  Heart,
};

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-navy-100 border border-navy-200 text-navy-800 text-xs font-bold uppercase tracking-wider">
            Our Core Values
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Why Choose Family Tours & Travels?
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We are committed to delivering comfortable, reliable, and family-oriented car travel experiences.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComp = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle hover:shadow-lg hover:border-gold-400/60 transition-all duration-300 space-y-4 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-900 text-gold-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all shadow-md">
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
