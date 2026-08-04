import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Tractor, Store, CalendarDays, 
  IndianRupee, ShieldCheck, Activity, 
  ChevronRight, AlertCircle, CheckCircle2,
  Server, Database, CloudRain, Clock
} from 'lucide-react';

const STATS = [
  { label: 'Total Farmers', value: '12,450', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/users' },
  { label: 'Equipment Owners', value: '3,210', icon: Tractor, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/users' },
  { label: 'Sprayer Operators', value: '840', icon: CloudRain, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/admin/users' },
  { label: 'Active Bookings', value: '458', icon: CalendarDays, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/bookings' },
];

const HEALTH = [
  { service: 'API Server', status: 'Operational', uptime: '99.9%', icon: Server },
  { service: 'Database cluster', status: 'Operational', uptime: '99.9%', icon: Database },
  { service: 'AI Plant Doctor', status: 'Operational', uptime: '98.5%', icon: Activity },
  { service: 'Payment Gateway', status: 'Degraded', uptime: '85.2%', icon: IndianRupee, warning: true },
];

const ACTIVITIES = [
  { id: 1, title: 'New Equipment Registered', desc: 'Suresh Patil registered a John Deere Tractor.', time: '10 mins ago', type: 'success' },
  { id: 2, title: 'Large Booking Completed', desc: 'Booking #BK-8475 completed successfully.', time: '1 hour ago', type: 'info' },
  { id: 3, title: 'Withdrawal Requested', desc: 'Ramesh Kumar requested ₹15,000 withdrawal.', time: '2 hours ago', type: 'warning' },
  { id: 4, title: 'AI Service Spike', desc: 'High volume of disease detection scans detected.', time: '3 hours ago', type: 'alert' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Monitor the pulse of the KisanO ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/reports')} className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-colors shadow-sm">
            View Reports
          </button>
          <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
            Generate Export
          </button>
        </div>
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -4 }}
            onClick={() => navigate(stat.link)}
            className="bg-white p-5 sm:p-6 rounded-[2rem] border border-gray-200 shadow-sm cursor-pointer hover:border-purple-200 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors shrink-0" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 truncate">{stat.value}</p>
              <p className="text-xs sm:text-sm font-bold text-gray-500 truncate">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        
        {/* REVENUE & ALERTS */}
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Revenue Overview (Mock Chart) */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900">Revenue Overview</h2>
                <p className="text-sm font-medium text-gray-500">Platform earnings for the last 7 days</p>
              </div>
              <h2 className="text-3xl font-black text-green-600">₹1,45,200</h2>
            </div>
            
            {/* CSS Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 mt-6 border-b border-gray-100 pb-2">
              {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                <div key={i} className="w-full flex flex-col justify-end items-center group h-full">
                  <div className="relative w-full h-full flex items-end">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      ₹{height * 1000}
                    </div>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="w-full bg-purple-100 group-hover:bg-purple-500 rounded-t-xl transition-colors relative"
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-2 shrink-0">Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900">Recent Platform Activity</h2>
              <button className="text-sm font-bold text-purple-600 hover:text-purple-700">View All</button>
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {ACTIVITIES.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-6">
                  <div className={`w-10 h-10 rounded-full border-4 border-white shadow flex items-center justify-center shrink-0 z-10 ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    activity.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    activity.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                     activity.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">{activity.title}</h4>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{activity.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Action Items */}
          <div className="bg-purple-900 rounded-[2.5rem] p-8 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-30 -mr-10 -mt-10"></div>
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-5 h-5 text-purple-300" /> Pending Actions
            </h2>
            <div className="space-y-3 relative z-10">
              <button onClick={() => navigate('/admin/verifications')} className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm">Verify Documents (12)</span>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              </button>
              <button onClick={() => navigate('/admin/support')} className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm">Support Tickets (5)</span>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              </button>
              <button onClick={() => navigate('/admin/payments')} className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <span className="font-bold text-sm">Withdraw Requests (8)</span>
                <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-[2.5rem] border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-gray-400" /> System Health
            </h3>
            <div className="space-y-4">
              {HEALTH.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.warning ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{item.service}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.uptime} Uptime</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.warning ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
