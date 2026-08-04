import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

const REVIEWS = [
  {
    id: 1,
    name: 'Suresh Patil',
    rating: 5,
    date: '12 Sep 2026',
    comment: 'Excellent spraying service. The operator was very professional and arrived exactly on time. Covered the entire 5 acres perfectly.',
    service: 'Pesticide Spraying',
    avatar: userAvatar
  },
  {
    id: 2,
    name: 'Anil Desai',
    rating: 4,
    date: '08 Sep 2026',
    comment: 'Good service, but arrived 15 mins late due to traffic. The spraying quality was great though.',
    service: 'Fertilizer Application',
    avatar: userAvatar
  }
];

export default function OperatorReviews() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Customer Reviews</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">See what farmers are saying about your service.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* OVERVIEW */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-gray-500 mb-2 uppercase tracking-wider text-xs">Average Rating</h3>
            <p className="text-6xl font-black text-gray-900 mb-4 tracking-tight">4.9</p>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-6 h-6 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <p className="text-sm font-medium text-gray-500">Based on 124 reviews</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 shadow-lg text-white">
            <h3 className="font-black mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Top Rated Operator</h3>
            <p className="text-sm text-amber-50 font-medium">
              You are in the top 5% of operators in your region. Keep up the great work to get more booking requests!
            </p>
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {REVIEWS.map((review) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-gray-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{review.name}</h4>
                    <p className="text-xs font-medium text-gray-500">{review.date} • {review.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-black text-amber-700">{review.rating}.0</span>
                </div>
              </div>
              
              <p className="text-gray-700 font-medium leading-relaxed mb-6">"{review.comment}"</p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Reply
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  <AlertTriangle className="w-4 h-4" /> Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
