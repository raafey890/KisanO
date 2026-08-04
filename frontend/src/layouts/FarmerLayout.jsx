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

const NAV = [
  { to: '/farmer/dashboard', label: 'Dashboard', icon: Home },
  { to: '/farmer/equipment', label: 'Rent Equipment', icon: Tractor },
  { to: '/farmer/marketplace', label: 'Marketplace', icon: Sprout },
  { to: '/farmer/sprayers', label: 'Spray Services', icon: Wind },
  { to: '/farmer/ai-doctor', label: 'AI Plant Doctor', icon: Bot },
  { to: '/farmer/bookings', label: 'My Bookings', icon: CalendarDays },
  { to: '/farmer/notifications', label: 'Notifications', icon: Bell },
  { to: '/farmer/profile', label: 'Profile', icon: User },
  { to: '/farmer/settings', label: 'Settings', icon: Settings },
];

export default function FarmerLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: '#fafafa' }}>
      <AppSidebar navItems={NAV} roleLabel="Farmer" roleColor="#15803d" roleBg="#dcfce7" />
      <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-10 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}