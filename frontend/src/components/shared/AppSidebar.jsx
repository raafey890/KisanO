import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, Bell } from 'lucide-react';
import { useAuthStore, authActions } from '../../features/auth';

export default function AppSidebar({ navItems, roleLabel, roleColor, roleBg }) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { logout } = authActions;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="relative flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0"
      style={{ background: '#fff', borderRight: '1px solid #e4e4e7' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5" style={{ borderBottom: '1px solid #f4f4f5' }}>
        <span className="text-2xl flex-shrink-0">🌾</span>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }} className="font-black text-lg tracking-tight overflow-hidden whitespace-nowrap">
              Kisan<span style={{ color: '#16a34a' }}>O</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Role badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-3 mt-3 px-3 py-2 rounded-lg text-center"
            style={{ background: roleBg, color: roleColor }}>
            <span className="text-[10px] font-bold uppercase tracking-wider">{roleLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Items */}
      <nav className="flex-1 px-3 pt-4 pb-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to || (to !== '/farmer/dashboard' && to !== '/owner/dashboard' && to !== '/admin/dashboard' && pathname.startsWith(to));
          return (
            <Link key={to} to={to} className="no-underline">
              <motion.div
                className="sidebar-link"
                style={isActive ? { background: '#000', color: '#fff' } : {}}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden text-sm">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid #f4f4f5' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-2" style={{ background: '#fafafa' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{ background: '#000', color: '#fff' }}>
            {user?.fullName?.[0]?.toUpperCase() || 'K'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user?.fullName}</p>
                <p className="text-[10px]" style={{ color: '#a1a1aa' }}>{user?.district}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button onClick={handleLogout} className="sidebar-link" style={{ color: '#dc2626' }} whileTap={{ scale: 0.97 }}>
          <LogOut size={16} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden text-sm">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse toggle */}
      <motion.button onClick={() => setCollapsed(!collapsed)} whileTap={{ scale: 0.92 }}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md z-10"
        style={{ background: '#fff', border: '1.5px solid #e4e4e7', color: '#52525b' }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>
    </motion.aside>
  );
}
