import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  MapPin,
  Sun,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore, authActions } from '../../features/auth';
import { useToast } from '../../context/ToastContext';

const DISTRICTS = ['Nashik', 'Pune', 'Ahmednagar', 'Aurangabad', 'Solapur', 'Satara', 'Kolhapur'];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Tractor Booking Confirmed', time: '10m ago', type: 'success', text: 'Mahindra 575 DI confirmed for tomorrow 8:00 AM.' },
  { id: 2, title: 'Plant Disease Warning', time: '1h ago', type: 'warning', text: 'Early blight detected in Nashik district fields.' },
  { id: 3, title: 'Marketplace Order Shipped', time: '3h ago', type: 'info', text: 'Hybrid Tomato seeds order #KO-9482 dispatched.' },
];

export default function TopBar({ setMobileOpen }) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const navigate = useNavigate();
  const { showInfo } = useToast();
  
  const user = useAuthStore((state) => state.user);
  const { logout } = authActions;

  const handleLogout = () => {
    logout();
    showInfo('Logged out');
    navigate('/');
  };

  return (
    <header className="h-20 bg-[#080d09]/90 border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Left: Mobile Toggle & District Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* District Selector Pill */}
        <div className="flex items-center gap-2 bg-gray-900 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-300">
          <MapPin className="w-4 h-4 text-green-400 shrink-0" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent text-white outline-none cursor-pointer pr-1 font-semibold"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d} className="bg-gray-900 text-white">
                {d}, MH
              </option>
            ))}
          </select>
        </div>

        {/* Weather Summary Pill (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3.5 py-2 rounded-xl text-xs font-bold text-green-400">
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>28°C • Sunny</span>
        </div>
      </div>

      {/* Center: Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search tractors, seeds, sprayers or AI plant doctor..."
          className="w-full bg-gray-900/80 border border-white/10 rounded-xl pl-10 pr-12 py-2 text-xs font-medium text-white placeholder-gray-500 outline-none focus:border-green-500/50 transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
          Ctrl K
        </span>
      </div>

      {/* Right: Notifications & User Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-gray-950 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Notifications ({unreadCount})
                  </h3>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[10px] font-bold text-green-400 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto my-2">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="py-3 flex items-start gap-3 hover:bg-white/5 px-2 rounded-xl transition-colors">
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                      {n.type === 'info' && <Bell className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{n.title}</h4>
                          <span className="text-[10px] text-gray-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 leading-snug">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/farmer/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="block text-center text-xs font-bold text-green-400 hover:underline pt-2 border-t border-white/10"
                >
                  View all notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 font-black text-xs flex items-center justify-center border border-green-500/30">
              {user?.name?.[0] || 'F'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white truncate max-w-[100px]">
                {user?.name || 'Farmer'}
              </span>
              <span className="text-[9px] font-bold text-green-400 uppercase">
                {user?.role || 'FARMER'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 space-y-1"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white">{user?.name || 'Farmer User'}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.identifier || 'farmer@kisano.in'}</p>
                </div>

                <Link
                  to="/farmer/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-green-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/farmer/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-green-400" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
