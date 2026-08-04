import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiTruck, FiShoppingBag, FiWind, FiSettings,
  FiLogOut, FiChevronLeft, FiChevronRight, FiBell,
} from 'react-icons/fi';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',        icon: FiGrid,        roles: ['FARMER','EQUIPMENT_OWNER','ADMIN'] },
  { id: 'equipment',    label: 'Rent Equipment',    icon: FiTruck,       roles: ['FARMER','ADMIN'] },
  { id: 'marketplace',  label: 'Naruu Exchange',    icon: FiShoppingBag, roles: ['FARMER','ADMIN'] },
  { id: 'sprayers',     label: 'Spray Services',    icon: FiWind,        roles: ['FARMER','ADMIN'] },
  { id: 'owner_manage', label: 'My Machinery',      icon: FiSettings,    roles: ['EQUIPMENT_OWNER','ADMIN'] },
];

const ROLE_LABEL = {
  FARMER: { label: 'Farmer', color: '#16a34a', bg: '#dcfce7' },
  EQUIPMENT_OWNER: { label: 'Equipment Owner', color: '#b45309', bg: '#fef3c7' },
  ADMIN: { label: 'Admin', color: '#1d4ed8', bg: '#dbeafe' },
};

export default function AppShell({ user, onLogout, activeTab, setActiveTab, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const filteredNav = NAV.filter(n => n.roles.includes(user?.role));
  const roleInfo = ROLE_LABEL[user?.role] || ROLE_LABEL.FARMER;
  const tabLabel = NAV.find(n => n.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex" style={{ background: '#fafafa' }}>

      {/* ─── SIDEBAR ─── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="relative flex flex-col h-screen sticky top-0 overflow-hidden"
        style={{ background: '#fff', borderRight: '1px solid #e4e4e7', flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5" style={{ borderBottom: '1px solid #f4f4f5' }}>
          <span className="text-2xl flex-shrink-0">🌾</span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-black text-lg tracking-tight uppercase overflow-hidden whitespace-nowrap"
                style={{ color: '#000' }}
              >
                KisanO
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 pt-4 pb-2 flex flex-col gap-1">
          {filteredNav.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                className="sidebar-link"
                style={isActive ? { background: '#000', color: '#fff' } : {}}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden text-sm"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#16a34a' }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom: User + Logout */}
        <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid #f4f4f5' }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-2"
            style={{ background: '#fafafa' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
              style={{ background: '#000', color: '#fff', flexShrink: 0 }}>
              {user?.fullName?.[0]?.toUpperCase() || 'K'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-bold truncate" style={{ color: '#000' }}>{user?.fullName}</p>
                  <p className="text-[10px]" style={{ color: '#a1a1aa' }}>{user?.district}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={onLogout}
            className="sidebar-link"
            style={{ color: '#dc2626' }}
            whileTap={{ scale: 0.97 }}
          >
            <FiLogOut size={16} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden text-sm"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Collapse toggle */}
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileTap={{ scale: 0.92 }}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md z-10"
          style={{ background: '#fff', border: '1.5px solid #e4e4e7', color: '#52525b' }}
        >
          {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
        </motion.button>
      </motion.aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-7 sticky top-0 z-20"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f4f4f5' }}>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold" style={{ color: '#000' }}>{tabLabel}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications bell */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#f4f4f5', color: '#27272a' }}
            >
              <FiBell size={16} />
              <span className="notif-dot absolute top-1.5 right-1.5" style={{ width: 7, height: 7 }} />
            </motion.button>

            {/* Role badge */}
            <div className="flex items-center gap-2.5 pl-4" style={{ borderLeft: '1px solid #e4e4e7' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                style={{ background: '#000', color: '#fff' }}>
                {user?.fullName?.[0]?.toUpperCase() || 'K'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold leading-tight" style={{ color: '#000' }}>{user?.fullName}</p>
                <span className="badge" style={{ background: roleInfo.bg, color: roleInfo.color, fontSize: 10 }}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-7 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
