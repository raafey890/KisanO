import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, Sun, 
  Sunrise, Moon, Zap, ArrowRight, IndianRupee, Info
} from 'lucide-react';

// Using a simple mock provider
const MOCK_PROVIDER = {
  id: 's1',
  name: 'Ramesh Kumar',
  serviceType: 'Professional Crop Spraying',
  startingPrice: 500,
  priceUnit: 'per acre',
  estimatedDuration: '2-3 Hours'
};

const DATES = [
  { day: 'Mon', date: 24, month: 'Aug', available: true },
  { day: 'Tue', date: 25, month: 'Aug', available: true },
  { day: 'Wed', date: 26, month: 'Aug', available: false },
  { day: 'Thu', date: 27, month: 'Aug', available: true },
  { day: 'Fri', date: 28, month: 'Aug', available: true },
  { day: 'Sat', date: 29, month: 'Aug', available: true },
  { day: 'Sun', date: 30, month: 'Aug', available: true },
];

const TIME_SLOTS = {
  Morning: [
    { id: 'm1', time: '06:00 AM', label: 'Sunrise (Best for Pesticides)' },
    { id: 'm2', time: '08:00 AM' },
    { id: 'm3', time: '10:00 AM' }
  ],
  Afternoon: [
    { id: 'a1', time: '12:00 PM' },
    { id: 'a2', time: '02:00 PM' },
    { id: 'a3', time: '04:00 PM' }
  ],
  Evening: [
    { id: 'e1', time: '06:00 PM' }
  ]
};

export default function ServiceBookingTimePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTimeId, setSelectedTimeId] = useState(null);
  const [acres, setAcres] = useState(1);

  const handleContinue = () => {
    navigate(`/farmer/sprayers/${id}/location`);
  };

  const totalPrice = acres * MOCK_PROVIDER.startingPrice;

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. BACK BUTTON & HEADER */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit pt-2 sm:pt-4"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Provider
        </button>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Select Date & Time
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500 mt-2">
            When do you need {MOCK_PROVIDER.name} for spraying?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Date & Time Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Date Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-green-600" /> Choose Date
            </h2>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x">
              {DATES.map((d, idx) => (
                <button
                  key={idx}
                  disabled={!d.available}
                  onClick={() => setSelectedDate(d)}
                  className={`snap-start shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                    !d.available ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400' :
                    selectedDate.date === d.date
                      ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/30 transform scale-105'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-400'
                  }`}
                >
                  <span className={`text-xs font-bold uppercase ${selectedDate.date === d.date ? 'text-green-100' : 'text-gray-500'}`}>
                    {d.day}
                  </span>
                  <span className="text-2xl font-black">{d.date}</span>
                  <span className={`text-[10px] font-bold uppercase ${selectedDate.date === d.date ? 'text-green-100' : 'text-gray-400'}`}>
                    {d.month}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Time Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-600" /> Choose Time
            </h2>
            
            <div className="space-y-8">
              
              {/* Morning */}
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-amber-500" /> Morning
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIME_SLOTS.Morning.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTimeId(slot.id)}
                      className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                        selectedTimeId === slot.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-400 bg-white'
                      }`}
                    >
                      <span className={`text-lg font-black ${selectedTimeId === slot.id ? 'text-green-700' : 'text-gray-900'}`}>
                        {slot.time}
                      </span>
                      {slot.label && (
                        <span className="text-[10px] font-bold text-amber-600 uppercase mt-1 bg-amber-50 px-2 py-0.5 rounded-full">
                          {slot.label}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" /> Afternoon
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.Afternoon.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTimeId(slot.id)}
                      className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        selectedTimeId === slot.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-400 bg-white'
                      }`}
                    >
                      <span className={`text-lg font-black ${selectedTimeId === slot.id ? 'text-green-700' : 'text-gray-900'}`}>
                        {slot.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Summary & Pricing */}
        <div className="space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col sticky top-8"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6">Service Summary</h3>
            
            {/* Area Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Area (in Acres)</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden p-1">
                <button 
                  onClick={() => setAcres(Math.max(1, acres - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-900 font-bold shadow-sm"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={acres}
                  onChange={(e) => setAcres(parseInt(e.target.value) || 1)}
                  className="w-full text-center bg-transparent border-none focus:ring-0 text-xl font-black text-gray-900"
                />
                <button 
                  onClick={() => setAcres(acres + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-900 font-bold shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Service</span>
                <span className="text-sm font-black text-gray-900">{MOCK_PROVIDER.serviceType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">Duration</span>
                <span className="text-sm font-black text-gray-900">{MOCK_PROVIDER.estimatedDuration}</span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
                <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                  <Info className="w-4 h-4" /> Selected Slot
                </span>
                <span className="text-sm font-black text-blue-900 text-right">
                  {selectedDate.date} {selectedDate.month} <br/> 
                  {selectedTimeId ? (
                    Object.values(TIME_SLOTS).flat().find(s => s.id === selectedTimeId)?.time
                  ) : (
                    'Not selected'
                  )}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Est. Price</span>
                <span className="text-3xl font-black text-gray-900">₹{totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={handleContinue}
              disabled={!selectedTimeId}
              className={`w-full h-14 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 ${
                selectedTimeId 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>

          </motion.div>

        </div>

      </div>

    </div>
  );
}
