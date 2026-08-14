import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Phone, 
  Star, 
  XCircle, 
  Eye, 
  Banknote,
  Tractor
} from 'lucide-react';
import { TractorEquipment } from '../../assets/images';

import { useFarmerBookings, useUpdateFarmerBookingStatus } from '../../features/booking/hooks/useBookings';

const TABS = ['Upcoming', 'Active', 'Completed', 'Cancelled'];

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const { data: bookings = [], isLoading } = useFarmerBookings();
  const { mutate: updateStatus } = useUpdateFarmerBookingStatus();

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateStatus({ id, status: 'Cancelled' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Active': return 'bg-green-50 text-green-600 border-green-200';
      case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-24 pt-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <p className="text-sm sm:text-base font-medium text-gray-500">
          Manage your equipment rentals and upcoming schedule.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-t-2xl font-black text-sm transition-all whitespace-nowrap border-b-4 ${
              activeTab === tab 
                ? 'border-green-600 text-green-700 bg-green-50/50' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 text-gray-400">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900">No {activeTab} Bookings</h3>
              <p className="text-gray-500 font-medium">You don't have any equipment rentals in this category.</p>
            </motion.div>
          ) : (
            filteredBookings.map(booking => (
              <motion.div 
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6"
              >
                
                {/* Image Section */}
                <div className="w-full lg:w-48 h-48 lg:h-auto shrink-0 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                  <img 
                    src={booking.equipment.image} 
                    alt={booking.equipment.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col justify-between gap-6">
                  
                  {/* Top Details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-md self-start">
                        {booking.equipment.type}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                        {booking.equipment.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-500">
                        Owner: <span className="text-gray-900">{booking.owner.name}</span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Amount</span>
                      <span className="text-xl font-black text-green-600">₹{booking.totalAmount.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-gray-400">ID: {booking.id}</span>
                    </div>
                  </div>

                  {/* Date Box & Owner Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Rental Dates</span>
                        <span className="text-sm font-black text-gray-900">{booking.rentalDates}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Contact Number</span>
                        <span className="text-sm font-black text-gray-900">{booking.owner.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    
                    <button className="flex-1 sm:flex-none h-12 bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider rounded-xl px-5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    
                    <a href={`tel:${booking.owner.phone}`} className="flex-1 sm:flex-none h-12 bg-blue-50 text-blue-700 hover:bg-blue-100 font-black text-xs uppercase tracking-wider rounded-xl px-5 transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-200">
                      <Phone className="w-4 h-4" /> Call Owner
                    </a>

                    {booking.status === 'Upcoming' && (
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        className="flex-1 sm:flex-none h-12 bg-red-50 text-red-600 hover:bg-red-100 font-black text-xs uppercase tracking-wider rounded-xl px-5 transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-200"
                      >
                        <XCircle className="w-4 h-4" /> Cancel Booking
                      </button>
                    )}

                    {booking.status === 'Completed' && (
                      <button className="flex-1 sm:flex-none h-12 bg-amber-50 text-amber-600 hover:bg-amber-100 font-black text-xs uppercase tracking-wider rounded-xl px-5 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200">
                        <Star className="w-4 h-4" /> Rate Equipment
                      </button>
                    )}

                  </div>
                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
