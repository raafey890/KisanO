import { CalendarDays, Bot, Sprout, Tag, Info } from 'lucide-react';

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    category: 'Bookings',
    title: 'Booking Confirmed',
    description: 'Your Sprayer Service booking with Ramesh Kumar for 27 Aug has been confirmed.',
    time: '2 hours ago',
    unread: true,
    icon: CalendarDays,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    id: 2,
    category: 'AI Alerts',
    title: 'High Risk Detected',
    description: 'Your recent scan of Cotton leaves shows a high severity of Bacterial Blight. Take action immediately.',
    time: '5 hours ago',
    unread: true,
    icon: Bot,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    id: 3,
    category: 'Marketplace',
    title: 'Order Shipped',
    description: 'Your order #ORD-7392 for NPK Fertilizer has been shipped and is out for delivery.',
    time: 'Yesterday',
    unread: false,
    icon: Sprout,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    id: 4,
    category: 'Offers',
    title: 'Discount on Harvester Rentals!',
    description: 'Get 20% off on all Harvester rentals this weekend. Use code HARV20 at checkout.',
    time: '2 days ago',
    unread: false,
    icon: Tag,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    id: 5,
    category: 'System',
    title: 'App Updated',
    description: 'KisanO has been updated to version 2.4. Enjoy the new AI Plant Doctor features!',
    time: '1 week ago',
    unread: false,
    icon: Info,
    color: 'text-gray-600',
    bg: 'bg-gray-100'
  }
];
