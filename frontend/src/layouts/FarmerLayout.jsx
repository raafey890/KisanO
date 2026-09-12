import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Home,
  Tractor,
  Sprout,
  Wind,
  Bot,
  CalendarDays,
  Bell,
  User,
  Settings,
} from 'lucide-react';
import AppSidebar from '../components/shared/AppSidebar';
import MobileBottomNav from '../components/shared/MobileBottomNav';

const NAV = [
  { to: '/farmer/dashboard', label: 'Home', icon: Home },
  { to: '/farmer/equipment', label: 'Rent', icon: Tractor },
  { to: '/farmer/marketplace', label: 'Market', icon: Sprout },
  { to: '/farmer/bookings', label: 'Orders', icon: CalendarDays },
  { to: '/farmer/profile', label: 'Profile', icon: User },
  { to: '/farmer/sprayers', label: 'Spray', icon: Wind },
  { to: '/farmer/ai-doctor', label: 'AI Doctor', icon: Bot },
  { to: '/farmer/notifications', label: 'Alerts', icon: Bell },
  { to: '/farmer/settings', label: 'Settings', icon: Settings },
];

export default function FarmerLayout() {
  return (
    <div className="min-h-screen flex pb-[60px] md:pb-0" style={{ background: '#fafafa' }}>
      <AppSidebar navItems={NAV} roleLabel="Farmer" roleColor="#15803d" roleBg="#dcfce7" />
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 lg:px-10">
        <Outlet />
      </main>
      <MobileBottomNav navItems={NAV} />
    </div>
  );
}