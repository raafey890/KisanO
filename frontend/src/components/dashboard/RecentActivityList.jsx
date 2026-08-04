import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tractor, ShoppingBag, Wind, Scan, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ACTIVITIES = [
  {
    id: 'ACT-101',
    type: 'equipment',
    title: 'Mahindra 575 DI Tractor Rental',
    desc: 'Booked for 2 days in Nashik West field',
    date: 'Today, 09:30 AM',
    status: 'Confirmed',
    badgeClass: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: Tractor,
    link: '/farmer/bookings',
  },
  {
    id: 'ACT-102',
    type: 'marketplace',
    title: 'Hybrid Tomato Seedlings Order',
    desc: '500 Trays ordered from AgriSeeds Ltd.',
    date: 'Yesterday, 04:15 PM',
    status: 'In Transit',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: ShoppingBag,
    link: '/farmer/marketplace',
  },
  {
    id: 'ACT-103',
    type: 'sprayer',
    title: 'Boom Sprayer Service Scheduled',
    desc: 'Assigned worker: Prakash Shinde',
    date: '28 Jul, 02:00 PM',
    status: 'Scheduled',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: Wind,
    link: '/farmer/sprayers',
  },
  {
    id: 'ACT-104',
    type: 'ai',
    title: 'AI Plant Doctor - Leaf Scan Result',
    desc: 'Health score 94% - Early blight risk detected',
    date: '27 Jul, 11:00 AM',
    status: 'Alert',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Scan,
    link: '/farmer/ai-doctor',
  },
];

export default function RecentActivityList() {
  const [filter, setFilter] = useState('all');

  const filteredList = filter === 'all'
    ? MOCK_ACTIVITIES
    : MOCK_ACTIVITIES.filter((a) => a.type === filter);

  return (
    <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight">Recent Activity</h3>
          <p className="text-xs text-gray-400 font-medium">Track your recent bookings, orders, and plant health scans.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-white/10 text-xs font-bold">
          {['all', 'equipment', 'marketplace', 'sprayer', 'ai'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === t ? 'bg-green-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'ai' ? 'AI Doctor' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-white/5">
        {filteredList.map((act) => {
          const Icon = act.icon;
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 flex items-start sm:items-center justify-between gap-4 hover:bg-white/5 px-3 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-green-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{act.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden md:block">
                  <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${act.badgeClass}`}>
                    {act.status}
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-1 font-medium">{act.date}</span>
                </div>

                <Link
                  to={act.link}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-500/20 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
