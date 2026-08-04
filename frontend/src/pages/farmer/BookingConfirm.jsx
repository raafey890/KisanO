import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CreditCard,
  Info,
  Phone,
  Home
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TractorEquipment } from '../../assets/images';
import api from '../../services/api';

export default function BookingConfirm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Safely extract equipment data
  const equipment = state?.equipment || {
    id: id || 'eq-1',
    equipmentName: 'Mahindra 575 DI 45 HP Tractor',
    equipmentType: 'Tractor',
    brand: 'Mahindra',
    dailyRate: 4500,
    image: TractorEquipment,
    owner: { fullName: 'Anandrao Deshmukh', village: 'Nashik West', phone: '+91 98765 43210' },
  };

  // Safely extract rental state
  const startDate = state?.startDate || new Date().toISOString().split('T')[0];
  const endDate = state?.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const numDays = state?.numDays || 2;
  const startTime = state?.startTime || '08:00 AM';
  const dailyRate = state?.dailyRate || equipment.dailyRate || 4500;
  const totalAmount = state?.totalAmount || (dailyRate * numDays);
  const platformFee = 0; // Keeping "No hidden charges" promise

  const handleConfirmBooking = async () => {
    if (!agreedToTerms) return;
    
    setLoading(true);
    try {
      // Simulate backend API delay
      await new Promise((res) => setTimeout(res, 1500));
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const mockBookingId = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-2xl w-full mx-auto my-8 sm:my-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 lg:p-14 text-center shadow-2xl flex flex-col gap-8 items-center relative overflow-hidden"
      >
        <div className="flex justify-center w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border-4 border-green-500/20 shadow-xl relative shrink-0"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border-2 border-green-500/30"
            />
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 stroke-[2.5]" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 self-center"
          >
            Booking Confirmed
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1"
          >
            You're All Set!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-md mx-auto"
          >
            Your booking for <strong className="text-gray-900">{equipment.equipmentName}</strong> has been successfully placed.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 border border-gray-200 rounded-3xl p-5 sm:p-8 text-left text-sm flex flex-col gap-4 sm:gap-5 w-full shadow-inner"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-gray-700 gap-1 sm:gap-4">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Booking ID:</span>
            <span className="font-black text-gray-900 text-sm sm:text-base">{mockBookingId}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-gray-700 gap-1 sm:gap-4">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Rental Dates:</span>
            <span className="font-black text-gray-900 text-sm sm:text-base">{new Date(startDate).toLocaleDateString('en-GB')} - {new Date(endDate).toLocaleDateString('en-GB')}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-gray-700 gap-1 sm:gap-4">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Total Amount:</span>
            <span className="font-black text-green-600 text-sm sm:text-base">₹{totalAmount.toLocaleString()} <span className="text-gray-500 text-xs font-bold">(Pay on Delivery)</span></span>
          </div>
          <div className="w-full h-px bg-gray-200 my-1 sm:my-2"></div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-gray-700 gap-1 sm:gap-4">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Owner Contact:</span>
            <span className="font-black text-gray-900 text-sm sm:text-base">{equipment.owner?.fullName} • {equipment.owner?.phone}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-2 w-full"
        >
          <a
            href={`tel:${equipment.owner?.phone}`}
            className="flex-1 h-14 sm:h-16 bg-green-600 hover:bg-green-700 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1"
          >
            <Phone className="w-5 h-5" /> Call Owner
          </a>
          <button
            onClick={() => navigate('/farmer/bookings')}
            className="flex-1 h-14 sm:h-16 bg-gray-900 hover:bg-gray-800 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1"
          >
            View Booking
          </button>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/farmer/dashboard')}
          className="text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 transition-colors mt-2 uppercase tracking-wider cursor-pointer"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Dashboard
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 font-sans pb-24 pt-4 px-2 sm:px-4">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-gray-900 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rental Duration</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Booking Summary</h1>
        <p className="text-sm font-medium text-gray-500">
          Review your rental details before placing the order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Details */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Equipment Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <img
                src={equipment.image}
                alt={equipment.equipmentName}
                className="w-20 h-20 rounded-2xl object-cover bg-gray-100 shrink-0"
              />
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-md self-start mb-1">
                  {equipment.equipmentType}
                </span>
                <h3 className="text-lg font-black text-gray-900 leading-tight">{equipment.equipmentName}</h3>
                <p className="text-xs font-bold text-gray-500 mt-1">Owned by {equipment.owner?.fullName}</p>
                <p className="text-xs font-bold text-gray-500 mt-0.5">Contact: {equipment.owner?.phone}</p>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" /> Rental Schedule
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Start Date</span>
                <span className="text-sm font-black text-gray-900">{new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="text-xs font-bold text-gray-400 mt-0.5">at {startTime}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Return Date</span>
                <span className="text-sm font-black text-gray-900">{new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="text-xs font-bold text-gray-400 mt-0.5">at {startTime}</span>
              </div>
            </div>
          </div>

          {/* Location & Payment Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" /> Logistics
            </h4>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-gray-900">Pickup Address</span>
                  <span className="text-sm font-medium text-gray-600">{equipment.owner?.village || 'Local Delivery Area'}</span>
                  <span className="text-xs text-green-600 font-bold mt-1">Free Delivery Included</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100"></div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-gray-900">Estimated Pickup Time</span>
                  <span className="text-sm font-black text-gray-900">{startTime}</span>
                  <span className="text-xs text-gray-500 font-medium">Please be available at the location.</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100"></div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-gray-900">Payment Method</span>
                  <span className="text-sm font-black text-gray-900">Pay on Delivery</span>
                  <span className="text-xs text-gray-500 font-medium">Pay directly to the owner via Cash or UPI when equipment arrives.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Cost & Checkout */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-white sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-wider text-green-400 flex items-center gap-2 border-b border-gray-700 pb-4">
              <ShieldCheck className="w-4 h-4" /> Price Breakdown
            </h3>

            <div className="flex flex-col gap-4 text-sm font-medium text-gray-300">
              <div className="flex justify-between items-center">
                <span>Rental Duration</span>
                <span className="font-bold text-white">{numDays} {numDays === 1 ? 'Day' : 'Days'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Price per Day</span>
                <span className="font-bold text-white">₹{dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Platform Fee</span>
                <span className="font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded text-xs">Waived</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Total Amount</span>
                <div className="text-3xl font-black text-white tracking-tight">₹{totalAmount.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-start">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded-md border-gray-600 bg-gray-800 checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer appearance-none"
                  />
                  {agreedToTerms && <CheckCircle2 className="w-5 h-5 text-white absolute inset-0 pointer-events-none scale-90" />}
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  I agree to the <a href="#" className="text-green-400 underline decoration-green-400/30 font-bold">Terms of Service</a> and <a href="#" className="text-green-400 underline decoration-green-400/30 font-bold">Cancellation Policy</a>.
                </span>
              </label>

              <button
                onClick={handleConfirmBooking}
                disabled={loading || !agreedToTerms}
                className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <Zap className="w-5 h-5 fill-white" />
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              <Info className="w-3 h-3" /> Booking is purely inquiry-based
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
