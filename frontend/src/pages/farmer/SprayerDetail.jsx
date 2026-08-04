import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Star, ShieldCheck, MapPin, Award, 
  CheckCircle2, Clock, Zap, Phone, Calendar, 
  Languages, Tractor, Droplet, UserCheck, MessageSquare
} from 'lucide-react';

import sprayerPerson1Img from '../../assets/services/sprayer_person1.jpg';

const PROVIDER = {
  id: 's1',
  name: 'Ramesh Kumar',
  serviceType: 'Professional Crop Spraying',
  startingPrice: 500,
  priceUnit: 'per acre',
  experience: 8,
  rating: 4.9,
  jobsCompleted: 342,
  distance: '2.5 km away',
  availableToday: true,
  image: sprayerPerson1Img,
  verified: true,
  about: 'I am a highly experienced agricultural sprayer specializing in both pesticide and fertilizer application. With over 8 years of experience working across Maharashtra, I ensure even coating and minimal chemical wastage. I use modern backpack sprayers and prioritize crop safety.',
  languages: ['Marathi', 'Hindi'],
  workingAreas: ['Pune District', 'Satara', 'Ahmednagar (Border)'],
  equipmentUsed: ['Battery Operated Knapsack Sprayer', 'Manual Boom Sprayer'],
  servicesOffered: [
    'Pesticide Spraying',
    'Liquid Fertilizer Application',
    'Weedicide Spraying',
    'Orchard Canopy Spraying'
  ],
  reviews: [
    {
      id: 1,
      name: 'Santosh Jadhav',
      rating: 5,
      date: '12 Jul 2026',
      comment: 'Excellent service. Reached the farm on time and finished spraying 5 acres in record time without wasting any chemicals.'
    },
    {
      id: 2,
      name: 'Prakash Patil',
      rating: 4,
      date: '02 Jul 2026',
      comment: 'Very professional. Guided me on the right mix ratio for the new fertilizer.'
    }
  ]
};

export default function SprayerDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // In a real app, fetch data based on ID

  const handleBookService = () => {
    navigate(`/farmer/sprayers/${id}/book-time`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. BACK BUTTON */}
      <button 
        onClick={() => navigate('/farmer/sprayers')}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit pt-2 sm:pt-4"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Services
      </button>

      {/* 2. MAIN PROFILE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row"
      >
        {/* Profile Image */}
        <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-gray-100 shrink-0">
          <img 
            src={PROVIDER.image} 
            alt={PROVIDER.name} 
            className="w-full h-full object-cover"
          />
          {PROVIDER.availableToday && (
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" /> Available Today
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {PROVIDER.name}
                </h1>
                {PROVIDER.verified && (
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                    <ShieldCheck className="w-4 h-4" /> Verified
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-green-600">{PROVIDER.serviceType}</p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400" />
                {PROVIDER.distance}
              </div>
            </div>

            {/* Price Tag */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:text-right shrink-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
              <div className="flex items-baseline gap-1 sm:justify-end">
                <span className="text-3xl font-black text-gray-900 leading-none">₹{PROVIDER.startingPrice}</span>
                <span className="text-sm font-bold text-gray-500">/{PROVIDER.priceUnit}</span>
              </div>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="flex flex-wrap gap-6 sm:gap-12 mt-8 py-6 border-y border-gray-100">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Rating</span>
              <div className="flex items-center gap-1.5 font-black text-gray-900 text-lg">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                {PROVIDER.rating}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Experience</span>
              <div className="flex items-center gap-1.5 font-black text-gray-900 text-lg">
                <Award className="w-5 h-5 text-blue-500" />
                {PROVIDER.experience} Years
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Jobs Done</span>
              <div className="flex items-center gap-1.5 font-black text-gray-900 text-lg">
                <UserCheck className="w-5 h-5 text-green-500" />
                {PROVIDER.jobsCompleted}+
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={handleBookService}
              className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" /> Book Service
            </button>
            <button 
              onClick={() => alert(`Calling ${PROVIDER.name}...`)}
              className="flex-1 sm:flex-none sm:w-48 h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" /> Call Provider
            </button>
          </div>

        </div>
      </motion.div>

      {/* 3. DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-green-600" /> About the Provider
            </h2>
            <p className="text-gray-600 font-medium leading-relaxed">
              {PROVIDER.about}
            </p>
          </motion.div>

          {/* Services Offered */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-green-600" /> Services Offered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROVIDER.servicesOffered.map((service, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="font-bold text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-green-600" /> Customer Reviews
              </h2>
              <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl">
                <Star className="w-4 h-4 fill-current text-amber-400" />
                <span className="font-bold">{PROVIDER.rating}</span>
              </div>
            </div>

            <div className="space-y-6">
              {PROVIDER.reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-black text-gray-900">{review.name}</h4>
                      <p className="text-xs font-bold text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sidebar Info) */}
        <div className="space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6"
          >
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-gray-900" /> Languages Spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {PROVIDER.languages.map(lang => (
                  <span key={lang} className="bg-gray-100 text-gray-700 font-bold text-sm px-3 py-1.5 rounded-lg border border-gray-200">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            
            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tractor className="w-4 h-4 text-gray-900" /> Equipment Used
              </h3>
              <ul className="space-y-2">
                {PROVIDER.equipmentUsed.map(equip => (
                  <li key={equip} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                    {equip}
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-900" /> Working Areas
              </h3>
              <ul className="space-y-2">
                {PROVIDER.workingAreas.map(area => (
                  <li key={area} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
}
