import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, ShieldCheck, Tractor, 
  Store, CalendarDays, IndianRupee, Activity, 
  Star, MessageSquare, Bell, BarChart3, 
  History, Settings, User, LogOut, Sprout
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', path: '/admin/users', icon: Users },
  { name: 'Verifications', path: '/admin/verifications', icon: ShieldCheck },
  { name: 'Equipment', path: '/admin/equipment', icon: Tractor },
  { name: 'Marketplace', path: '/admin/marketplace', icon: Store },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
  { name: 'Payments', path: '/admin/payments', icon: IndianRupee },
  { name: 'AI Reports', path: '/admin/ai-reports', icon: Activity },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Support', path: '/admin/support', icon: MessageSquare },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Activity Logs', path: '/admin/activity-logs', icon: History },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
  { name: 'Profile', path: '/admin/profile', icon: User },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col sticky top-0 md:h-screen z-40 shadow-sm shrink-0">
        
        {/* Logo Area */}
        <div 
          onClick={() => navigate('/')}
          className="h-20 flex items-center gap-3 px-8 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-gray-900 block">KisanO</span>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Admin Console</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700 font-bold' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 bg-purple-50 rounded-2xl border border-purple-200/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="relative z-10 text-sm">{item.name}</span>
                
                {item.name === 'Verifications' && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm">
                    12
                  </span>
                )}
                {item.name === 'Support' && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm">
                    5
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Super Admin</p>
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span> System Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/auth/login')}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-red-600 font-bold hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4 opacity-80" />
            <span className="text-sm">Secure Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full bg-[#f8fafc] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        <div className="h-full overflow-y-auto relative z-10">
          <Outlet />
        </div>
      </main>

    </div>
  );
}