import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, MapPin, Package, ArrowRight,
  ShoppingBag, Home
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  
  useEffect(() => {
    // Subtle confetti celebration on load
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#22c55e', '#16a34a', '#4ade80']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#22c55e', '#16a34a', '#4ade80']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-3xl mx-auto font-sans pb-32 pt-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-[80vh] flex flex-col items-center justify-center">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-14 shadow-sm w-full text-center relative overflow-hidden"
      >
        {/* Subtle background radar/pulse effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-50 rounded-full animate-ping opacity-50 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-100 rounded-full animate-pulse opacity-50 z-0"></div>
        
        {/* Success Icon */}
        <div className="relative z-10 flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-100"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
        </div>

        {/* Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 space-y-2 mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Order Confirmed!</h1>
          <p className="text-lg font-medium text-gray-500">Thank you for shopping with KisanO Marketplace.</p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
            <span className="text-lg font-black text-gray-900">{orderId}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</span>
            <span className="text-sm font-black text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">Paid Successfully</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Delivery</span>
            <span className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" /> By Tomorrow, 8 PM
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Address</span>
            <span className="text-sm font-medium text-gray-700 leading-snug flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /> 
              Survey No. 45, Near Hanuman Temple, Village Shirpur, Pune, 411001
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => alert("Tracking page coming soon!")}
            className="w-full sm:w-auto h-14 px-8 bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            Track Order <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => navigate('/farmer/marketplace')}
            className="w-full sm:w-auto h-14 px-8 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/farmer/dashboard')}
          className="relative z-10 mt-8 text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Dashboard
        </motion.button>

      </motion.div>

    </div>
  );
}
