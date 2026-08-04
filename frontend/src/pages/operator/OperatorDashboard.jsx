import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, CalendarDays, IndianRupee, Star, 
  MapPin, Clock, CheckCircle2, ChevronRight, Activity, 
  Sun, CloudRain, Wind, ShieldCheck
} from 'lucide-react';

import operatorAvatar from '../../assets/ai/farmer_3d_icon.jpg'; 

const STATS = [
  { label: "Today's Jobs", value: '3', icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50', link: '/operator/jobs' },
  { label: 'Pending Requests', value: '5', icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-50', link: '/operator/jobs' },
  { label: 'Monthly Earnings', value: '₹28,500', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', link: '/operator/earnings' },
  { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', link: '/operator/reviews' },
];

const SCHEDULE = [
  { id: 1, time: '09:00 AM', status: 'completed', farmer: 'Ramesh Patil', location: 'Village Khed', crop: 'Sugarcane', type: 'Pesticide' },
  { id: 2, time: '01:00 PM', status: 'current', farmer: 'Anil Desai', location: 'Village Shirur', crop: 'Cotton', type: 'Fertilizer' },
  { id: 3, time: '04:30 PM', status: 'upcoming', farmer: 'Suresh Kumar', location: 'Village Baramati', crop: 'Wheat', type: 'Herbicide' },
];

export default function OperatorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* 1. WELCOME CARD & WEATHER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center md:items-start gap-6 relative z-10 flex-col sm:flex-row text-center sm:text-left min-w-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0 relative">
              <img src={operatorAvatar} alt="Operator" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="pt-1 min-w-0 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight truncate">Ready to spray, Vinod!</h1>
              <p className="text-sm font-medium text-gray-500 mt-2 truncate">You have 3 jobs scheduled for today.</p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 shrink-0 w-full sm:w-auto items-center sm:items-stretch">
            <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-green-200 shadow-sm whitespace-nowrap">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Accepting Jobs
            </div>
            <button 
              onClick={() => navigate('/operator/jobs')}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg whitespace-nowrap"
            >
              View Schedule
            </button>
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="font-bold text-blue-100 uppercase tracking-wider text-xs mb-1">Pune, MH</p>
              <h2 className="text-3xl font-black">28°C</h2>
            </div>
            <Sun className="w-10 h-10 text-yellow-300 shrink-0" />
          </div>
          
          <div className="relative z-10 space-y-4 mt-6">
            <p className="font-medium text-blue-100 text-sm">Perfect conditions for spraying today.</p>
            <div className="flex items-center gap-4 text-xs font-bold bg-blue-800/30 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-blue-200" /> 12 km/h</span>
              <span className="flex items-center gap-1.5"><CloudRain className="w-4 h-4 text-blue-200" /> 0% Rain</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -4 }}
            onClick={() => navigate(stat.link)}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 truncate">{stat.value}</p>
              <p className="text-xs sm:text-sm font-bold text-gray-500 truncate">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. TODAY'S SCHEDULE TIMELINE */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Today's Schedule
            </h2>
            <button 
              onClick={() => navigate('/operator/calendar')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View Calendar
            </button>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {SCHEDULE.map((job) => (
              <div key={job.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Timeline Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                  job.status === 'completed' ? 'text-green-500' :
                  job.status === 'current' ? 'text-blue-500 ring-2 ring-blue-500/20' : 'text-gray-400'
                }`}>
                  {job.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      job.status === 'completed' ? 'text-green-600' :
                      job.status === 'current' ? 'text-blue-600' : 'text-gray-400'
                    }`}>{job.time}</span>
                    {job.status === 'current' && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">In Progress</span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 truncate">{job.farmer}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-3 truncate">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 flex-wrap">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold">{job.crop}</span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold">{job.type}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 4. SIDEBAR ACTIONS */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
              <Activity className="w-5 h-5 text-blue-400" /> Quick Actions
            </h2>
            <div className="space-y-3 relative z-10">
              <button onClick={() => navigate('/operator/jobs')} className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm truncate text-left mr-2">Review Pending Jobs (5)</span>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              </button>
              <button onClick={() => navigate('/operator/earnings')} className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm truncate text-left mr-2">Withdraw Earnings</span>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              </button>
              <button onClick={() => navigate('/operator/profile/edit')} className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm truncate text-left mr-2">Update Equipment</span>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              </button>
            </div>
          </div>

          {/* Recent Earnings Mini-card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2">Recent Payments</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <p className="font-bold text-sm text-gray-900 truncate">Suresh Patil</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Today, 10:30 AM</p>
                </div>
                <span className="font-black text-green-600 shrink-0">+₹1,200</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="min-w-0 pr-4">
                  <p className="font-bold text-sm text-gray-900 truncate">Anil Desai</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Yesterday</p>
                </div>
                <span className="font-black text-green-600 shrink-0">+₹950</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
