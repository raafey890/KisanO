import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, CheckCircle2, XCircle, Phone, 
  MessageSquare, CalendarDays, Clock, MapPin, IndianRupee
} from 'lucide-react';

import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

const TABS = ['Pending', 'Accepted', 'Active', 'Completed', 'Cancelled'];

const MOCK_BOOKINGS = [
  {
    id: 'BK-7829',
    status: 'Pending',
    farmer: 'Suresh Patil',
    equipment: 'Mahindra 575 DI XP Plus',
    date: '12 Sep 2026',
    duration: '2 Days',
    amount: 1600,
    location: 'Village Khed, Pune',
    avatar: userAvatar
  },
  {
    id: 'BK-7830',
    status: 'Accepted',
    farmer: 'Ramesh Kumar',
    equipment: 'John Deere Harvester',
    date: '15 Sep 2026',
    duration: '1 Day',
    amount: 2500,
    location: 'Village Shirur, Pune',
    avatar: userAvatar
  },
  {
    id: 'BK-7821',
    status: 'Active',
    farmer: 'Anil Desai',
    equipment: 'Rotavator',
    date: 'Today',
    duration: '3 Days',
    amount: 1200,
    location: 'Village Baramati, Pune',
    avatar: userAvatar
  }
];

export default function OwnerBookings() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const handleStatusChange = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Booking Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage rental requests and active bookings.</p>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200">
        {TABS.map(tab => {
          const count = bookings.filter(b => b.status === tab).length;
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-amber-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 3. BOOKINGS LIST */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div 
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-6">
                  
                  {/* Farmer Details */}
                  <div className="w-full lg:w-1/3 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <img src={booking.avatar} alt="Farmer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1 block">Renter</span>
                      <h3 className="text-lg font-black text-gray-900 leading-tight">{booking.farmer}</h3>
                      <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {booking.location}
                      </p>
                      
                      {/* Contact Actions */}
                      <div className="flex gap-2 mt-4">
                        <button className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2 sm:col-span-4 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Equipment</span>
                      <p className="font-bold text-gray-900">{booking.equipment}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">ID</span>
                      <p className="font-bold text-gray-700 text-sm">{booking.id}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1"><CalendarDays className="inline w-3 h-3 mr-1"/> Date</span>
                      <p className="font-bold text-gray-700 text-sm">{booking.date}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1"><Clock className="inline w-3 h-3 mr-1"/> Duration</span>
                      <p className="font-bold text-gray-700 text-sm">{booking.duration}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Amount</span>
                      <p className="font-black text-gray-900 flex items-center"><IndianRupee className="w-3 h-3" /> {booking.amount}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="w-full lg:w-48 flex flex-col justify-center gap-3">
                    {booking.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(booking.id, 'Accepted')}
                          className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button 
                          onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                          className="w-full h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-red-200"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'Accepted' && (
                      <button 
                        onClick={() => handleStatusChange(booking.id, 'Active')}
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                      >
                        Start Rental
                      </button>
                    )}
                    {booking.status === 'Active' && (
                      <button 
                        onClick={() => handleStatusChange(booking.id, 'Completed')}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                    {['Completed', 'Cancelled'].includes(booking.status) && (
                      <div className={`px-4 py-3 rounded-xl text-center font-bold text-sm border ${
                        booking.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {booking.status}
                      </div>
                    )}
                    <button className="w-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mt-2">
                      View Details
                    </button>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner mb-6">
                <ClipboardList className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No {activeTab.toLowerCase()} bookings</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-6">
                You don't have any bookings in this category right now.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
