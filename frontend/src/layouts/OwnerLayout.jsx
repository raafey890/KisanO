import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Tractor, ClipboardList, CalendarDays, IndianRupee, Star, Bell, User } from 'lucide-react';
import AppSidebar from '../components/shared/AppSidebar';
import MobileBottomNav from '../components/shared/MobileBottomNav';

const NAV = [
  { to: '/owner/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/owner/equipment', label: 'Equipment', icon: Tractor },
  { to: '/owner/bookings',  label: 'Bookings', icon: ClipboardList },
  { to: '/owner/earnings',  label: 'Earnings', icon: IndianRupee },
  { to: '/owner/profile',   label: 'Profile', icon: User },
  { to: '/owner/calendar',  label: 'Calendar', icon: CalendarDays },
  { to: '/owner/reviews',   label: 'Reviews', icon: Star },
  { to: '/owner/notifications', label: 'Alerts', icon: Bell },
];

export default function OwnerLayout() {
  return (
    <div className="min-h-screen flex pb-[60px] md:pb-0" style={{ background: '#fafafa' }}>
      <AppSidebar navItems={NAV} roleLabel="Equipment Owner" roleColor="#b45309" roleBg="#fef3c7" />
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-7 md:py-6">
        <Outlet />
      </main>
      <MobileBottomNav navItems={NAV} />
    </div>
  );
}