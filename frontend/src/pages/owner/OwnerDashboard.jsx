import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Tractor, ClipboardList, IndianRupee, ArrowUpRight, 
  Settings, Bell, Plus, CalendarDays, Activity, Wrench,
  Clock, CheckCircle2, ChevronRight, User
} from 'lucide-react';
import { useOwnerDashboard } from '../../features/owner/hooks/useOwnerDashboard';

import ownerAvatar from '../../assets/ai/farmer_3d_icon.jpg';

const STATS = [
  { label: "Today's Bookings", value: '4', icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50', link: '/owner/bookings' },
  { label: 'Pending Requests', value: '12', icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-50', link: '/owner/bookings' },
  { label: 'Active Rentals', value: '8', icon: Tractor, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/owner/equipment' },
  { label: 'Monthly Earnings', value: '₹45,200', icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50', link: '/owner/earnings' },
];

const FLEET_STATUS = [
  { label: 'Available', value: '15', color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Rented Out', value: '8', color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'In Maintenance', value: '2', color: 'text-red-600', bg: 'bg-red-100' },
];

const ACTIVITIES = [
  { id: 1, title: 'Pickup: John Deere Harvester', desc: 'Ramesh Kumar • Today, 10:00 AM', type: 'pickup', icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 2, title: 'Return: Mahindra Tractor', desc: 'Suresh Patil • Today, 05:00 PM', type: 'return', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 3, title: 'Payment Received', desc: '₹4,500 from Vinod for Rotavator', type: 'payment', icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { isLoading, isError } = useOwnerDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32">
      
      {/* 1. WELCOME CARD */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex items-center sm:items-start gap-6 relative z-10 flex-col sm:flex-row text-center sm:text-left">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0">
            <img src={ownerAvatar} alt="Owner" className="w-full h-full object-cover" />
          </div>
          <div className="pt-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, Vikram!</h1>
            <p className="text-gray-500 font-medium mt-1">Here is what's happening with your rental business today.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={() => navigate('/owner/equipment/add')}
            className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
          <button 
            onClick={() => navigate('/owner/notifications')}
            className="w-12 h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {STATS.map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                onClick={() => navigate(stat.link)}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-amber-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* FLEET STATUS */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Tractor className="w-5 h-5 text-amber-600" /> Fleet Overview
              </h2>
              <button 
                onClick={() => navigate('/owner/equipment')}
                className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Manage Fleet
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {FLEET_STATUS.map((status, idx) => (
                <div key={idx} className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-gray-600 text-sm">{status.label}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-black ${status.bg} ${status.color}`}>
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Recent Activity
            </h2>
            <div className="space-y-4">
              {ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{activity.title}</h4>
                    <p className="text-xs font-medium text-gray-500">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/owner/bookings')}
              className="w-full mt-4 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors"
            >
              View All Activity
            </button>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gray-900 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <h2 className="text-lg font-black mb-4">Quick Links</h2>
            <div className="space-y-2 relative z-10">
              <button onClick={() => navigate('/owner/calendar')} className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Availability Calendar</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button onClick={() => navigate('/owner/reviews')} className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm flex items-center gap-2"><Star className="w-4 h-4" /> Customer Reviews</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button onClick={() => navigate('/owner/profile')} className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm flex items-center gap-2"><User className="w-4 h-4" /> Business Profile</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
