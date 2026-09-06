import React from 'react';
import { MessageSquareQuote, Star, Heart } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppLink } from '../constants/config';

const Reviews = () => {
  // Configured as empty array until business provides genuine reviews
  const reviewsData = []; 

  return (
    <section id="reviews" className="py-20 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider">
            Traveler Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We prioritize customer satisfaction, vehicle cleanliness, and passenger safety on every travel journey.
          </p>
        </div>

        {reviewsData.length === 0 ? (
          /* Elegant Non-Fake Placeholder State */
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-subtle text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold-50 text-gold-600 mx-auto flex items-center justify-center border border-gold-200">
              <MessageSquareQuote className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-navy-900">
                Customer reviews will appear here.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                We are dedicated to building genuine relationships with our travelers. Verified customer testimonials and travel feedback will be displayed here as our guests complete their journeys with Family Tours & Travels.
              </p>
            </div>

            {/* Star Rating Graphic Placeholder */}
            <div className="flex items-center justify-center space-x-1 text-gold-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppLink("Hello, I recently traveled with Family Tours & Travels and would like to share my feedback.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-gold-400" />
                <span>Share Your Travel Experience</span>
              </a>
            </div>
          </div>
        ) : (
          /* Grid ready for when business adds genuine reviews in the future */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reviews mapping goes here */}
          </div>
        )}

      </div>
    </section>
  );
};

export default Reviews;
