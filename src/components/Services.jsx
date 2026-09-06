import React from 'react';
import { SERVICES, getWhatsAppLink } from '../constants/config';
import { Car, MapPin, Compass, Plane, Camera, CalendarCheck, MessageSquare, HeartHandshake, ArrowRight } from 'lucide-react';

const iconMap = {
  Car,
  MapPin,
  Compass,
  Plane,
  Camera,
  CalendarCheck,
  MessageSquare,
  HeartHandshake,
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Our Travel Services
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Comfortable travel solutions for every journey — local, outstation, airport transfers and customized car-based tour packages.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon] || Car;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 shadow-subtle border border-slate-200/80 hover:shadow-xl hover:border-gold-400/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 group-hover:bg-gold-500 group-hover:text-navy-950 flex items-center justify-center transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {service.highlight}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-navy-800 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom CTA Action */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  {service.id === 'whatsapp-support' ? (
                    <a
                      href={getWhatsAppLink(`Enquiry regarding ${service.title}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <span>Contact on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href="#booking"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-gold-600 transition-colors"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Driver Service Highlight Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-navy-700 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gold-400">
              Need a Custom Journey Plan?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Tell us your pickup location, destination and travel dates. We will tailor a comfortable Suzuki Ertiga travel experience for your family.
            </p>
          </div>
          <a
            href="#booking"
            className="px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm shadow-md transition-all whitespace-nowrap"
          >
            Plan Your Journey
          </a>
        </div>

      </div>
    </section>
  );
};

export default Services;
