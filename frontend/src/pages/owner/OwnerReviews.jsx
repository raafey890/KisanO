import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

const REVIEWS = [
  {
    id: 1,
    author: 'Suresh Patil',
    date: '10 Sep 2026',
    rating: 5,
    equipment: 'Mahindra 575 DI XP Plus',
    comment: 'Excellent tractor, very well maintained. Vikram was very helpful and delivered it on time. Highly recommended!',
    reply: 'Thank you Suresh! Happy to help.',
    avatar: userAvatar
  },
  {
    id: 2,
    author: 'Ramesh Kumar',
    date: '28 Aug 2026',
    rating: 4,
    equipment: 'John Deere Harvester',
    comment: 'Good machine, worked perfectly for my wheat field. A bit expensive but worth it.',
    reply: null,
    avatar: userAvatar
  }
];

export default function OwnerReviews() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="pt-2 sm:pt-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Customer Reviews</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">Manage feedback and build your reputation on KisanO.</p>
      </div>

      {/* RATING SUMMARY */}
      <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        
        {/* Average */}
        <div className="text-center md:text-left shrink-0">
          <h2 className="text-6xl font-black text-gray-900 mb-2">4.8</h2>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Based on 124 reviews</p>
        </div>

        {/* Distribution */}
        <div className="flex-1 w-full space-y-2">
          {[
            { stars: 5, pct: 85 },
            { stars: 4, pct: 10 },
            { stars: 3, pct: 5 },
            { stars: 2, pct: 0 },
            { stars: 1, pct: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-bold text-gray-600 w-12 shrink-0">
                {bar.stars} <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
              </div>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.pct}%` }}></div>
              </div>
              <div className="w-8 text-right text-xs font-bold text-gray-400 shrink-0">{bar.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEW LIST */}
      <div className="space-y-6">
        {REVIEWS.map(review => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-1">
                    {review.author} <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </h4>
                  <p className="text-xs font-medium text-gray-500">{review.date} • {review.equipment}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 font-medium leading-relaxed mb-6">"{review.comment}"</p>

            {review.reply ? (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 ml-4 sm:ml-12 relative">
                <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 border-t border-l border-gray-100 transform -rotate-45"></div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Your Reply</p>
                <p className="text-sm font-medium text-gray-700">{review.reply}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4 sm:ml-12 border-t border-gray-100 pt-4">
                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Reply
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors ml-auto">
                  <AlertTriangle className="w-4 h-4" /> Report
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </div>
  );
}
