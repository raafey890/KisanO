import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate a dummy month (e.g., September 2026 starting on Tuesday)
const DATES = Array.from({ length: 35 }, (_, i) => {
  const day = i - 1; // 1st is Tuesday (index 2)
  if (day < 1 || day > 30) return null;
  return day;
});

const getStatus = (date) => {
  if ([5, 6].includes(date)) return 'booked';
  if ([12, 13, 14].includes(date)) return 'booked';
  if ([20, 21].includes(date)) return 'maintenance';
  if ([25, 26].includes(date)) return 'blocked';
  return 'available';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'booked': return 'bg-amber-100 text-amber-900 border-amber-300 font-black';
    case 'maintenance': return 'bg-red-100 text-red-900 border-red-300 font-black';
    case 'blocked': return 'bg-gray-200 text-gray-500 border-gray-300 line-through';
    default: return 'bg-white text-gray-900 border-gray-100 hover:border-amber-500 hover:shadow-sm font-medium';
  }
};

export default function OwnerCalendar() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Availability Calendar</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage your fleet's availability and maintenance schedules.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select className="h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-gray-700 outline-none shadow-sm cursor-pointer">
            <option>All Equipment</option>
            <option>Mahindra 575 DI XP Plus</option>
            <option>John Deere Harvester</option>
          </select>
          <button className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Block Dates
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. CALENDAR AREA */}
        <div className="lg:col-span-2 flex-1 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-amber-500" /> September 2026
            </h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                Today
              </button>
              <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {day}
              </div>
            ))}
            
            {DATES.map((date, idx) => {
              if (!date) return <div key={idx} className="aspect-square rounded-2xl bg-gray-50/50"></div>;
              
              const status = getStatus(date);
              
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: status === 'available' ? 1.05 : 1 }}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group ${getStatusColor(status)}`}
                >
                  <span className="text-lg sm:text-xl">{date}</span>
                  {status !== 'available' && (
                    <span className="text-[10px] uppercase tracking-wide mt-1 hidden sm:block opacity-80">{status}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. SIDEBAR (Legend & Upcoming) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6">
            <h3 className="font-black text-gray-900 mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
                <span className="text-sm font-bold text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
                <span className="text-sm font-bold text-amber-900">Booked</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                <span className="text-sm font-bold text-red-900">Maintenance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300"></div>
                <span className="text-sm font-bold text-gray-500 line-through">Blocked (Holiday)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-4">Upcoming Schedule</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-amber-500 pl-4 py-1">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Sep 5 - Sep 6</p>
                <p className="font-bold text-gray-900 text-sm">Booking: Suresh Patil</p>
                <p className="text-xs font-medium text-gray-500">Mahindra 575 DI XP Plus</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-4 py-1">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Sep 12 - Sep 14</p>
                <p className="font-bold text-gray-900 text-sm">Booking: Ramesh Kumar</p>
                <p className="text-xs font-medium text-gray-500">John Deere Harvester</p>
              </div>
              <div className="border-l-2 border-red-500 pl-4 py-1 bg-red-50/50 rounded-r-xl">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Sep 20 - Sep 21</p>
                <p className="font-bold text-gray-900 text-sm">Scheduled Maintenance</p>
                <p className="text-xs font-medium text-gray-500">All Equipment (Oil Change)</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
