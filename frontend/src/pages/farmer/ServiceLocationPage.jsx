import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Navigation, Map as MapIcon, 
  Leaf, ArrowRight, MessageSquare
} from 'lucide-react';

export default function ServiceLocationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [address, setAddress] = useState('');
  const [cropType, setCropType] = useState('Cotton');
  const [instructions, setInstructions] = useState('');

  const handleReviewBooking = () => {
    navigate(`/farmer/sprayers/${id}/review`);
  };

  const handleUseLocation = () => {
    setAddress("Survey No. 45, Near Hanuman Temple, Village Shirpur, Pune, 411001");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. BACK BUTTON & HEADER */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit pt-2 sm:pt-4"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Date & Time
        </button>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Service Location
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500 mt-2">
            Where should the professional come to spray?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Map & Address */}
        <div className="space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" /> Farm Address
              </h2>
              
              <button 
                onClick={handleUseLocation}
                className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <Navigation className="w-4 h-4" /> Current Location
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
              <MapIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Interactive Map</span>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Detailed Address / Landmark</label>
              <textarea
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="E.g., Near the old banyan tree, behind the main village road..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-green-500 transition-all font-medium resize-none"
              ></textarea>
            </div>
            
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Crop Details & Action */}
        <div className="space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" /> Farm Details
            </h2>
            
            {/* Crop Type Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-bold focus:outline-none focus:border-green-500 transition-all cursor-pointer appearance-none"
              >
                <option>Cotton</option>
                <option>Sugarcane</option>
                <option>Wheat</option>
                <option>Soybean</option>
                <option>Pomegranate</option>
                <option>Grapes</option>
                <option>Other</option>
              </select>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Special Instructions (Optional)
              </label>
              <textarea
                rows="4"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any specific mixing ratios? Hard to reach areas? Mention them here..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-green-500 transition-all font-medium resize-none"
              ></textarea>
            </div>

          </motion.div>

          <button 
            onClick={handleReviewBooking}
            disabled={!address.trim()}
            className={`w-full h-14 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 ${
              address.trim()
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Review Booking <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
}
