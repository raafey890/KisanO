import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Calendar, Clock, 
  RefreshCw, Star, Eye, XCircle, Phone, CheckCircle2, 
  Droplet, Award, Zap
} from 'lucide-react';

import sprayerPerson1Img from '../../assets/services/sprayer_person1.jpg';
import sprayerPerson2Img from '../../assets/services/sprayer_person2.jpg';
import sprayerDroneImg from '../../assets/services/sprayer_drone.jpg';

import { useSprayerBookings } from '../../features/operator/hooks/useOperator';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

export default function SprayerHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: bookings = [], isLoading } = useSprayerBookings();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'Upcoming': return <Calendar className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Droplet className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = booking.status === activeTab;
    const matchesSearch = booking.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.provider.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <div className="flex flex-col gap-6 pt-4 sm:pt-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Service History
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500 mt-2">
            Track and manage your sprayer service bookings.
          </p>
        </div>

        {/* Flexbox Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:flex-1 flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-green-500 focus-within:shadow-sm transition-all group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 font-medium ml-3 w-full"
              placeholder="Search by provider name, service or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="w-full sm:w-auto h-14 px-6 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 snap-x">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`snap-start px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap border-2 ${
              activeTab === tab 
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. BOOKINGS LIST */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <motion.div 
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5"
              >
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                      #{booking.id}
                    </span>
                    <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" /> {booking.date}
                    </span>
                    <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" /> {booking.time}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-gray-100">
                    <img 
                      src={booking.provider.image} 
                      alt={booking.provider.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-green-600">
                      {booking.provider.serviceType}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                      {booking.provider.name}
                    </h3>
                  </div>

                  {/* Buttons Group */}
                  <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    
                    {booking.status === 'Upcoming' && (
                      <button className="w-full sm:w-48 h-10 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" /> Call Provider
                      </button>
                    )}

                    {booking.status === 'Completed' && (
                      <div className="flex gap-2 w-full sm:w-48">
                        <button className="flex-1 h-10 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                          <Star className="w-4 h-4" /> Rate
                        </button>
                        <button className="flex-1 h-10 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4" /> Book
                        </button>
                      </div>
                    )}

                    {booking.status === 'Cancelled' && (
                      <button className="w-full sm:w-48 h-10 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Book Again
                      </button>
                    )}

                    <button className="w-full sm:w-48 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner mb-6">
                <Droplet className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-8">
                {searchQuery 
                  ? "We couldn't find any bookings matching your search." 
                  : `You don't have any ${activeTab.toLowerCase()} sprayer services.`}
              </p>
              <button 
                onClick={() => navigate('/farmer/sprayers')}
                className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
              >
                Find Sprayer Services
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
