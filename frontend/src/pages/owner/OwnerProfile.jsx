import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Mail, ShieldCheck, CalendarDays, 
  Tractor, ClipboardList, IndianRupee, Edit3, Bell, Settings, 
  HelpCircle, LogOut, ChevronRight, CheckCircle2, Briefcase
} from 'lucide-react';

import ownerImg from '../../assets/ai/farmer_3d_icon.jpg'; 

export default function OwnerProfile() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const stats = [
    { label: 'Total Fleet', value: '15', icon: Tractor, color: 'text-amber-600', bg: 'bg-amber-50', link: '/owner/equipment' },
    { label: 'Completed Bookings', value: '142', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', link: '/owner/bookings' },
    { label: 'Total Earnings', value: '₹3.2L', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', link: '/owner/earnings' },
  ];

  const menuItems = [
    { label: 'Business Settings', icon: Briefcase, link: '#', color: 'text-gray-700' },
    { label: 'Notifications', icon: Bell, link: '/owner/notifications', color: 'text-gray-700' },
    { label: 'Account Settings', icon: Settings, link: '#', color: 'text-gray-700' },
    { label: 'Help & Support', icon: HelpCircle, link: '#', color: 'text-gray-700' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. PROFILE HEADER */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="h-32 sm:h-48 bg-gray-900 w-full relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 -mt-16 sm:-mt-20 relative z-10 text-center sm:text-left">
          
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full p-2 shadow-xl shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
              <img src={ownerImg} alt="Owner Profile" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vikram Equipment Rentals</h1>
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-sm font-bold text-gray-500 mt-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> Pune, Maharashtra</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-gray-400" /> Partner since 2022</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/owner/profile/edit')}
            className="hidden sm:flex h-12 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm rounded-xl transition-colors shadow-sm items-center gap-2 mb-2"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. STATS & INFO */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">Business Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate(stat.link)}
                  className="bg-gray-50 hover:bg-gray-100 p-5 rounded-2xl border border-gray-100 transition-colors cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">Business Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Owner Name</p>
                  <p className="font-bold text-gray-900">Vikram Desai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Business Phone</p>
                  <p className="font-bold text-gray-900">+91 98765 12345</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Email</p>
                  <p className="font-bold text-gray-900">vikram.rentals@example.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Bank Details</p>
                  <p className="font-bold text-gray-900">HDFC Bank •••• 4582</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. MENU & LOGOUT */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(item.link)}
                className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-900">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowLogoutDialog(true)}
            className="w-full h-14 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-base rounded-2xl transition-colors border border-red-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* 4. LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setShowLogoutDialog(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <LogOut className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Sign Out?</h2>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                Are you sure you want to sign out of your Host account?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutDialog(false)}
                  className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
