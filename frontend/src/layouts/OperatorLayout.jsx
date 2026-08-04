import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ClipboardList, CalendarDays, 
  IndianRupee, Users, Star, Bell, User, LogOut, 
  Droplets, Power
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/operator/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', path: '/operator/jobs', icon: ClipboardList },
  { name: 'Calendar', path: '/operator/calendar', icon: CalendarDays },
  { name: 'Earnings', path: '/operator/earnings', icon: IndianRupee },
  { name: 'Customers', path: '/operator/customers', icon: Users },
  { name: 'Reviews', path: '/operator/reviews', icon: Star },
  { name: 'Notifications', path: '/operator/notifications', icon: Bell },
  { name: 'Profile', path: '/operator/profile', icon: User },
];

export default function OperatorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 md:h-screen z-40 shadow-sm shrink-0">
        
        {/* Logo Area */}
        <div 
          onClick={() => navigate('/')}
          className="h-20 flex items-center gap-3 px-8 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-gray-900 block">KisanO</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Operator Portal</span>
          </div>
        </div>

        {/* Online Status Toggle */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-gray-700">Online</span>
            </div>
            <button className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900">
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all relative group ${
                  isActive 
                    ? 'bg-amber-50 text-amber-700 font-bold' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="operator-sidebar-active"
                    className="absolute inset-0 bg-amber-50 rounded-2xl border border-amber-200/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-amber-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="relative z-10">{item.name}</span>
                
                {item.name === 'Jobs' && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
                    2
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 opacity-80" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 w-full bg-[#f8fafc] relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        
        {/* Dynamic Route Content */}
        <div className="h-full overflow-y-auto relative z-10">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
