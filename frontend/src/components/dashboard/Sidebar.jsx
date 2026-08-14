import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Tractor,
  ShoppingBag,
  Wind,
  Scan,
  CalendarDays,
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sprout,
  X,
} from 'lucide-react';
import { useAuthStore, authActions } from '../../features/auth';
import { useToast } from '../../context/ToastContext';

const NAV_ITEMS = [
  { to: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/farmer/equipment', label: 'Equipment Rental', icon: Tractor },
  { to: '/farmer/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/farmer/sprayers', label: 'Sprayer Services', icon: Wind },
  { to: '/farmer/ai-doctor', label: 'AI Plant Doctor', icon: Scan, badge: 'AI' },
  { to: '/farmer/bookings', label: 'My Bookings', icon: CalendarDays },
  { to: '/farmer/notifications', label: 'Notifications', icon: Bell, count: 3 },
  { to: '/farmer/messages', label: 'Messages', icon: MessageSquare },
  { to: '/farmer/profile', label: 'Profile', icon: User },
  { to: '/farmer/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const user = useAuthStore((state) => state.user);
  const { logout } = authActions;
  const { showInfo } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showInfo('Signed out successfully');
    navigate('/');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#080d09] text-gray-300 border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6 text-green-400" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">
                Kisan<span className="text-green-400">O</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-400/80">
                Farmer Hub
              </span>
            </div>
          )}
        </div>

        {/* Desktop collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* User Mini Card (Expanded) */}
      {!collapsed && (
        <div className="p-4 mx-3 my-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 font-black flex items-center justify-center border border-green-500/30 text-sm">
            {user?.name?.[0] || 'F'}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-xs font-black text-white truncate">{user?.name || 'Farmer Portal'}</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {user?.role || 'FARMER'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all relative group ${
                  isActive
                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate flex-1">{item.label}</span>}

              {!collapsed && item.badge && (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-400/20 text-green-300 border border-green-400/30">
                  {item.badge}
                </span>
              )}

              {!collapsed && item.count && (
                <span className="text-[10px] font-black w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-red-500/20"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full"
            >
              {SidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
