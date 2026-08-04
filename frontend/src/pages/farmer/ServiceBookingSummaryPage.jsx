import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Calendar, Clock, ShieldCheck, 
  Leaf, CheckCircle2, Droplet, ArrowRight, Phone
} from 'lucide-react';

import sprayerPerson1Img from '../../assets/services/sprayer_person1.jpg';

export default function ServiceBookingSummaryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock booking data
  const BOOKING = {
    provider: {
      name: 'Ramesh Kumar',
      serviceType: 'Professional Crop Spraying',
      image: sprayerPerson1Img,
      verified: true
    },
    date: 'Thursday, 27 Aug 2026',
    time: '06:00 AM (Morning)',
    duration: '2-3 Hours',
    location: 'Survey No. 45, Near Hanuman Temple, Village Shirpur, Pune, 411001',
    cropType: 'Cotton',
    fieldSize: '3 Acres',
    pricing: {
      serviceCharge: 1500,
      platformFee: 50,
      tax: 270,
      total: 1820
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      // In a real flow, this would go to a success page or payment
      // For now, we'll navigate to order-success to mimic a complete flow
      navigate('/farmer/sprayers/success');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. BACK BUTTON & HEADER */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit pt-2 sm:pt-4"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Location
        </button>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Review Booking
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500 mt-2">
            Please confirm your service details before booking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Provider Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex items-start gap-5"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
              <img src={BOOKING.provider.image} alt={BOOKING.provider.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-green-600">
                {BOOKING.provider.serviceType}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  {BOOKING.provider.name}
                </h2>
                {BOOKING.provider.verified && (
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Schedule & Location */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <h3 className="text-lg font-black text-gray-900 mb-2">Schedule & Location</h3>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Date</p>
                  <p className="text-base font-black text-gray-900">{BOOKING.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Time & Duration</p>
                  <p className="text-base font-black text-gray-900">{BOOKING.time} • {BOOKING.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Farm Address</p>
                  <p className="text-base font-bold text-gray-900 leading-snug max-w-md">{BOOKING.location}</p>
                </div>
              </div>

              <hr className="border-gray-100 my-2" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Estimated Arrival Time</p>
                  <p className="text-base font-black text-gray-900">05:45 AM - 06:15 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Provider Contact</p>
                  <p className="text-base font-black text-gray-900">+91 98765 43210 (Visible after confirmation)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Farm Details */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h3 className="text-lg font-black text-gray-900 mb-6">Farm Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                <Leaf className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Crop Type</p>
                  <p className="text-sm font-black text-gray-900">{BOOKING.cropType}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                <Droplet className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Field Size</p>
                  <p className="text-sm font-black text-gray-900">{BOOKING.fieldSize}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Payment Summary */}
        <div className="space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col sticky top-8"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Service Charges ({BOOKING.fieldSize})</span>
                <span className="text-sm font-black text-gray-900">₹{BOOKING.pricing.serviceCharge}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Platform Fee</span>
                <span className="text-sm font-black text-gray-900">₹{BOOKING.pricing.platformFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Taxes</span>
                <span className="text-sm font-black text-gray-900">₹{BOOKING.pricing.tax}</span>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            <div className="bg-green-50 rounded-2xl p-5 mb-6 border border-green-100">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-green-800 uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-green-700">₹{BOOKING.pricing.total}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-blue-800 leading-relaxed">
                By confirming, you agree to pay the service provider directly after the job is completed. No advance payment required.
              </p>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`w-full h-14 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 ${
                isProcessing 
                  ? 'bg-green-700 text-white opacity-80 cursor-wait'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <>Confirm Booking <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            
          </motion.div>

        </div>

      </div>

    </div>
  );
}
