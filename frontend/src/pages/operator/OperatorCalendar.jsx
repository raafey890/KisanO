import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Power } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate dummy calendar days
const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push({
      date: i,
      jobs: i === 12 || i === 15 ? 2 : i === 18 ? 1 : 0,
      isBlocked: i === 22 || i === 23,
      isCompleted: i < 12 && i % 2 !== 0
    });
  }
  return days;
};

export default function OperatorCalendar() {
  const [currentMonth] = useState('September 2026');
  const days = generateDays();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Availability & Schedule</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage your spraying schedule and set unavailability.</p>
        </div>
        
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`h-12 px-6 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
            isOnline ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <Power className="w-4 h-4" />
          {isOnline ? 'You are Online (Accepting Jobs)' : 'You are Offline (Not Accepting)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 2. CALENDAR MAIN */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-500" /> {currentMonth}
            </h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {/* Empty slots for start of month offset */}
            <div className="aspect-square"></div>
            <div className="aspect-square"></div>
            
            {days.map((day, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all border ${
                  day.isBlocked ? 'bg-red-50 border-red-100 opacity-50' :
                  day.jobs > 0 ? 'bg-blue-50 border-blue-200 shadow-sm' : 
                  day.isCompleted ? 'bg-green-50 border-green-100' :
                  'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <span className={`text-sm sm:text-base font-bold ${
                  day.isBlocked ? 'text-red-700' :
                  day.jobs > 0 ? 'text-blue-700' :
                  day.isCompleted ? 'text-green-700' :
                  'text-gray-700'
                }`}>
                  {day.date}
                </span>
                
                {day.jobs > 0 && (
                  <span className="absolute bottom-1.5 sm:bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
                {day.isCompleted && (
                  <span className="absolute bottom-1.5 sm:bottom-2 w-1.5 h-1.5 rounded-full bg-green-500"></span>
                )}
              </motion.div>
            ))}
          </div>

        </div>

        {/* 3. LEGEND & SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-4">Legend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Scheduled Jobs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Completed Jobs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-50 border border-red-100"></div>
                <span className="text-sm font-medium text-gray-700">Blocked / Unavailable</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-white border border-gray-200"></div>
                <span className="text-sm font-medium text-gray-700">Available</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 shadow-lg text-white">
            <h3 className="font-black mb-2">Block a Date</h3>
            <p className="text-sm text-blue-100 font-medium mb-4">
              Taking a leave or doing equipment maintenance? Mark dates as unavailable.
            </p>
            <button className="w-full py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              Mark Unavailable
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
