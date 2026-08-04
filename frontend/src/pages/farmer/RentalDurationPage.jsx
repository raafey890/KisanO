import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Minus,
  Plus,
  Zap,
  CheckCircle2,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TractorEquipment } from '../../assets/images';

export default function RentalDurationPage() {
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

  // State: Start Date, Duration Days, Start Time
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(state?.date || tomorrowStr);
  const [numDays, setNumDays] = useState(2);
  const [startTime, setStartTime] = useState('08:00 AM');

  const dailyRate = equipment.dailyRate || 4500;

  // Calculate End Date automatically
  const getEndDate = () => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + (numDays - 1));
    return start.toISOString().split('T')[0];
  };

  const endDate = getEndDate();
  const totalCost = dailyRate * numDays;

  const handleReviewBooking = () => {
    navigate(`/farmer/equipment/${id}/book`, {
      state: {
        equipment,
        startDate,
        endDate,
        numDays,
        startTime,
        dailyRate,
        totalAmount: totalCost,
        date: startDate,
        slotLabel: `${numDays} Days (${startDate} to ${endDate}) @ ${startTime}`,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 font-sans pb-24 pt-2 px-2 sm:px-4">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-gray-900 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Availability</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rental Duration</h1>
        <p className="text-sm font-medium text-gray-500">
          Select rental dates and duration for{' '}
          <strong className="text-gray-900">{equipment.equipmentName}</strong>.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-8">
        {/* 1. DATE SELECTION GRID (Start Date & Calculated End Date) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Start Date Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-green-600" />
              <span>Rental Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-14 bg-gray-50 border-2 border-gray-200 focus:border-gray-900 text-gray-900 font-bold text-sm rounded-2xl px-4 outline-none transition-all cursor-pointer block"
            />
          </div>

          {/* Calculated End Date Display */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-green-600" />
              <span>Rental End Date (Auto-Calculated)</span>
            </label>
            <div className="w-full h-14 bg-green-50 border-2 border-green-200 text-green-950 font-black text-sm rounded-2xl px-4 flex items-center justify-between">
              <span>{new Date(endDate).toDateString()}</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* 2. NUMBER OF DAYS SELECTOR (Counter & Slider) */}
        <div className="flex flex-col gap-5 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">
              Total Rental Days
            </label>
            <span className="text-2xl font-black text-gray-900 bg-gray-100 px-4 py-1 rounded-xl">
              {numDays} {numDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Plus/Minus Counter Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNumDays(Math.max(1, numDays - 1))}
              className="w-14 h-14 shrink-0 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-xl flex items-center justify-center border border-gray-300 transition-all cursor-pointer"
            >
              <Minus className="w-6 h-6" />
            </button>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max="14"
              value={numDays}
              onChange={(e) => setNumDays(parseInt(e.target.value))}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />

            <button
              onClick={() => setNumDays(Math.min(14, numDays + 1))}
              className="w-14 h-14 shrink-0 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-xl flex items-center justify-center border border-gray-300 transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {[1, 2, 3, 5, 7, 10].map((days) => (
              <button
                key={days}
                onClick={() => setNumDays(days)}
                className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  numDays === days
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days} {days === 1 ? 'Day' : 'Days'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. RENTAL START TIME */}
        <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
          <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-green-600" />
            <span>Select Daily Delivery Time</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM'].map((time) => (
              <button
                key={time}
                onClick={() => setStartTime(time)}
                className={`p-4 rounded-2xl text-sm font-extrabold transition-all text-center border cursor-pointer ${
                  startTime === time
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md ring-2 ring-green-500/30'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SIMPLE COST SUMMARY */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 sm:p-8 rounded-3xl flex flex-col gap-5 shadow-2xl mt-4">
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-green-400">
              Cost Summary
            </span>
            <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-400" /> No hidden charges
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm font-medium text-gray-300">
            <div className="flex justify-between items-center">
              <span>Daily Rate:</span>
              <span className="font-bold text-white text-base">₹{dailyRate.toLocaleString()} / day</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Rental Duration:</span>
              <span className="font-bold text-white text-base">{numDays} {numDays === 1 ? 'Day' : 'Days'}</span>
            </div>
            <div className="flex justify-between items-center text-green-400">
              <span>Delivery & Operator:</span>
              <span className="font-bold text-base">Included Free</span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-5 flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-gray-400">
                Total Rental Cost
              </span>
              <div className="text-4xl font-black text-white tracking-tight">
                ₹{totalCost.toLocaleString()}
              </div>
            </div>

            <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-black uppercase px-4 py-2 rounded-xl">
              Pay on Delivery
            </span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <button
          onClick={handleReviewBooking}
          className="w-full h-16 mt-2 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
        >
          <span>Review Booking</span>
          <Zap className="w-6 h-6 fill-white" />
        </button>
      </div>
    </div>
  );
}
