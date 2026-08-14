import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Check, X, CheckCircle, SearchX } from 'lucide-react';
import { useBookings, useUpdateBookingStatus } from '../../features/owner/hooks/useBookings';

const BookingRequests = () => {
  const { data: bookings = [], isLoading: loading } = useBookings();
  const { mutate: updateStatus } = useUpdateBookingStatus();
  
  const [filter, setFilter] = useState('Pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setActionLoading(id);
    updateStatus({ id, status: newStatus }, {
      onSuccess: () => {
        setFeedbackMessage(`Booking ${newStatus.toLowerCase()} successfully`);
        setTimeout(() => setFeedbackMessage(null), 3000);
      },
      onError: (error) => {
        console.error(`Error updating status to ${newStatus}`, error);
        alert('Failed to update booking status');
      },
      onSettled: () => {
        setActionLoading(null);
      }
    });
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.bookingStatus === filter);

  const tabs = ['Pending', 'Approved', 'Completed', 'Rejected', 'All'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'badge-amber';
      case 'Approved': return 'badge-green';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200 border';
      case 'Rejected': return 'badge-red';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 border';
    }
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Booking Requests</h1>
          <p className="text-gray-500 font-medium mt-1">Manage reservations for your machinery</p>
        </div>
      </div>

      {feedbackMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100 font-medium"
        >
          <CheckCircle size={20} />
          {feedbackMessage}
        </motion.div>
      )}

      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              filter === tab 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <SearchX size={48} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No {filter !== 'All' ? filter.toLowerCase() : ''} bookings</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">There are currently no booking requests matching this status.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id || booking._id} className="card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${getStatusBadge(booking.bookingStatus)} px-3 py-1 rounded-full text-xs font-bold`}>
                    {booking.bookingStatus}
                  </span>
                  <span className="text-xs font-bold text-gray-400">ID: {(booking.id || booking._id)?.substring(0, 8)}...</span>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-4">{booking.equipment?.equipmentName || 'Equipment Name'}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <User size={16} className="text-gray-400" />
                    <span>{booking.farmer?.fullName || 'Farmer Name'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total</span>
                  <span className="text-xl font-black text-gray-900">₹{booking.totalAmount}</span>
                </div>
              </div>
              
              <div className="mt-auto p-4 border-t border-gray-100 bg-white">
                {booking.bookingStatus === 'Pending' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusChange(booking.id || booking._id, 'Approved')}
                      disabled={actionLoading === (booking.id || booking._id)}
                      className="btn btn-green flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold"
                    >
                      <Check size={18} />
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusChange(booking.id || booking._id, 'Rejected')}
                      disabled={actionLoading === (booking.id || booking._id)}
                      className="btn btn-danger flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold"
                    >
                      <X size={18} />
                      Reject
                    </button>
                  </div>
                )}
                
                {booking.bookingStatus === 'Approved' && (
                  <button 
                    onClick={() => handleStatusChange(booking.id || booking._id, 'Completed')}
                    disabled={actionLoading === (booking.id || booking._id)}
                    className="btn btn-black w-full flex justify-center items-center gap-2 py-2.5 rounded-xl font-bold"
                  >
                    <CheckCircle size={18} />
                    Mark Complete
                  </button>
                )}
                
                {(booking.bookingStatus === 'Completed' || booking.bookingStatus === 'Rejected') && (
                  <div className="text-center py-2 text-sm font-bold text-gray-400">
                    No actions available
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookingRequests;
