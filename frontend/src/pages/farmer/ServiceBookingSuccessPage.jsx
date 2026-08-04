import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Phone, Calendar, ArrowRight, Home, 
  UserCheck, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ServiceBookingSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
        
        {/* Top Celebration Banner */}
        <div className="h-32 bg-green-600 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 translate-y-10"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-green-400 rounded-full -z-10"
            ></motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-8 px-6 sm:px-10 text-center flex flex-col items-center">
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-gray-900 mb-2 tracking-tight"
          >
            Booking Confirmed!
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 font-medium text-lg mb-8"
          >
            Your spraying service is secured.
          </motion.p>

          {/* Details Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left space-y-4 mb-8"
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-500">Booking ID</span>
              <span className="text-sm font-black text-gray-900 bg-gray-200 px-2 py-1 rounded-md">#SPY-88492</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm font-black text-gray-900">Ramesh Kumar</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm font-bold text-gray-700">Thursday, 27 Aug 2026</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm font-bold text-gray-700">06:00 AM (Estimated Arrival 5:45 AM)</span>
              </div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-3"
          >
            <button 
              onClick={() => alert('Calling Ramesh Kumar: +91 98765 43210')}
              className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-black text-base rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" /> Call Provider
            </button>
            
            <button 
              onClick={() => navigate('/farmer/sprayers/history')}
              className="w-full h-14 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-base rounded-2xl transition-colors border border-green-200 flex items-center justify-center gap-2"
            >
              View Booking Details <ArrowRight className="w-5 h-5" />
            </button>

            <button 
              onClick={() => navigate('/farmer/dashboard')}
              className="w-full h-14 bg-transparent hover:bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Home className="w-4 h-4" /> Back to Dashboard
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
