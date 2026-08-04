import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Tractor, ClipboardList, CalendarDays, IndianRupee, Star, Bell, User } from 'lucide-react';
import AppSidebar from '../components/shared/AppSidebar';

const NAV = [
  { to: '/owner/dashboard', label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/owner/equipment', label: 'My Equipment',     icon: Tractor },
  { to: '/owner/bookings',  label: 'Bookings',         icon: ClipboardList },
  { to: '/owner/calendar',  label: 'Calendar',         icon: CalendarDays },
  { to: '/owner/earnings',  label: 'Earnings',         icon: IndianRupee },
  { to: '/owner/reviews',   label: 'Reviews',          icon: Star },
  { to: '/owner/notifications', label: 'Notifications', icon: Bell },
  { to: '/owner/profile',   label: 'Profile',          icon: User },
];

export default function OwnerLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: '#fafafa' }}>
      <AppSidebar navItems={NAV} roleLabel="Equipment Owner" roleColor="#b45309" roleBg="#fef3c7" />
      <main className="flex-1 overflow-y-auto px-7 py-6">
        <Outlet />
      </main>
    </div>
  );
}