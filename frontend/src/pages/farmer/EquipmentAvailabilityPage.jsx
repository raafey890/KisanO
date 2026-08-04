import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Zap,
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TractorEquipment } from '../../assets/images';

export default function EquipmentAvailabilityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const equipment = state?.equipment || {
    id: id || 'eq-1',
    equipmentName: 'Mahindra 575 DI 45 HP Tractor',
    equipmentType: 'Tractor',
    brand: 'Mahindra',
    dailyRate: 4500,
    hourlyRate: 650,
    image: TractorEquipment,
  };

  // Calendar State (Default to current month: July 2026)
  const [currentYear] = useState(2026);
  const [currentMonth] = useState(6); // 0-indexed (6 = July)
  const [selectedDay, setSelectedDay] = useState(29);

  // Time Slot State
  const [selectedSlot, setSelectedSlot] = useState('full_day');

  // Days in July 2026 (31 Days, starts on Wednesday)
  const daysInMonth = 31;
  const startDayOfWeek = 3; // Wednesday (0=Sun, 1=Mon, 2=Tue, 3=Wed...)

  // Status mapping for days in July 2026:
  // Green: Available, Yellow: Partial, Red: Booked
  const getDayStatus = (day) => {
    if ([5, 12, 18, 24].includes(day)) return 'booked'; // Red
    if ([8, 15, 22].includes(day)) return 'partial'; // Yellow
    return 'available'; // Green
  };

  const TIME_SLOTS = [
    {
      id: 'morning',
      label: 'Morning Slot',
      time: '6:00 AM - 11:00 AM',
      price: Math.round(equipment.dailyRate * 0.55),
      desc: 'Ideal for early tilling & plowing',
    },
    {
      id: 'afternoon',
      label: 'Afternoon Slot',
      time: '12:00 PM - 4:00 PM',
      price: Math.round(equipment.dailyRate * 0.45),
      desc: 'Mid-day field operation',
    },
    {
      id: 'evening',
      label: 'Evening Slot',
      time: '4:00 PM - 7:00 PM',
      price: Math.round(equipment.dailyRate * 0.35),
      desc: 'Late harvest & transport',
    },
    {
      id: 'full_day',
      label: 'Full Day Rental',
      time: '8:00 AM - 5:00 PM (8 Hours)',
      price: equipment.dailyRate || 4500,
      desc: 'Best value for complete field work',
    },
  ];

  const currentSlotObj = TIME_SLOTS.find((s) => s.id === selectedSlot) || TIME_SLOTS[3];

  const handleContinue = () => {
    const formattedDate = `2026-07-${selectedDay.toString().padStart(2, '0')}`;
    navigate(`/farmer/equipment/${id}/duration`, {
      state: {
        equipment,
        date: formattedDate,
        timeSlot: currentSlotObj.time,
        slotLabel: `${currentSlotObj.label} (${currentSlotObj.time})`,
        hourlyRate: equipment.hourlyRate || 650,
        totalAmount: currentSlotObj.price,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-24 pt-2 px-2 sm:px-4">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-gray-900 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Details</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Check Availability</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Select your preferred rental date and time slot for{' '}
          <strong className="text-gray-900">{equipment.equipmentName}</strong>.
        </p>
      </div>

      {/* 1. SIMPLE MONTHLY CALENDAR CARD */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Calendar Header & Status Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-black text-gray-900">July 2026</h2>
          </div>

          {/* Simple Status Legend */}
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-gray-700">
              <span className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-200" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-gray-700">
              <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-200" /> Partial
            </span>
            <span className="flex items-center gap-1.5 text-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-400 ring-2 ring-red-200" /> Booked
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-black uppercase tracking-wider text-gray-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {/* Empty offset padding for days before July 1 (Wednesday) */}
          {Array.from({ length: startDayOfWeek }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-12 sm:h-14" />
          ))}

          {/* 31 Days of July */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const status = getDayStatus(day);
            const isSelected = selectedDay === day;
            const isBooked = status === 'booked';

            let statusDotColor = 'bg-green-500';
            if (status === 'partial') statusDotColor = 'bg-amber-400';
            if (status === 'booked') statusDotColor = 'bg-red-500';

            return (
              <button
                key={day}
                disabled={isBooked}
                onClick={() => setSelectedDay(day)}
                className={`h-12 sm:h-14 rounded-2xl font-black text-sm flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                  isBooked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'bg-gray-900 text-white shadow-lg ring-4 ring-green-500/30 scale-105'
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100 hover:border-gray-300 border border-gray-200'
                }`}
              >
                <span>{day}</span>
                {!isBooked && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${
                      isSelected ? 'bg-green-400' : statusDotColor
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECTED DATE & AVAILABLE TIME SLOTS */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Selected Date Header */}
        <div className="bg-gradient-to-r from-gray-900 to-green-950 text-white p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-green-400 block">
              Selected Date
            </span>
            <h3 className="text-lg font-black text-white">
              July {selectedDay}, 2026
            </h3>
          </div>
          <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-extrabold px-3 py-1.5 rounded-full">
            Available Now
          </span>
        </div>

        {/* Time Slot Selection (Morning, Afternoon, Evening, Full Day) */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">
            Select Time Slot
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xl ring-2 ring-green-500/30'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-extrabold block">{slot.label}</span>
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 mt-1 ${
                          isSelected ? 'text-green-400' : 'text-gray-500'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> {slot.time}
                      </span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {slot.desc}
                    </span>
                    <span className="text-base font-black">₹{slot.price?.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RENTAL PRICE SUMMARY FOR SELECTED DATE */}
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Estimated Rental Price
            </span>
            <span className="text-xs text-gray-400">For July {selectedDay}, 2026 ({currentSlotObj.label})</span>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black text-gray-900">
              ₹{currentSlotObj.price?.toLocaleString()}
            </div>
            <span className="text-[10px] font-bold text-green-700 uppercase">Pay on Delivery</span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <button
          onClick={handleContinue}
          className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.35)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <span>Continue to Booking</span>
          <Zap className="w-5 h-5 fill-white" />
        </button>
      </div>
    </div>
  );
}
