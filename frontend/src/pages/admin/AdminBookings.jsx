import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Filter } from 'lucide-react';

const BOOKINGS = [
  { id: 'BK-1001', type: 'Equipment', farmer: 'Vikram Singh', provider: 'Suresh Patil', item: 'John Deere Tractor', amount: '₹2,400', status: 'Active', date: 'Today' },
  { id: 'BK-1002', type: 'Sprayer', farmer: 'Anil Desai', provider: 'Vinod', item: 'Pesticide Spraying', amount: '₹1,500', status: 'Completed', date: 'Yesterday' },
  { id: 'BK-1003', type: 'Equipment', farmer: 'Ramesh Kumar', provider: 'Amit', item: 'Seed Drill', amount: '₹900', status: 'Pending', date: '29 Jul 2026' },
];

export default function AdminBookings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Booking Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Overview of all equipment and service bookings.</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Parties</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {BOOKINGS.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-gray-900 text-sm">{booking.id}</p>
                    <p className="text-xs font-medium text-gray-500">{booking.date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-gray-900 text-sm">{booking.item}</p>
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">{booking.type}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900"><span className="text-gray-500 text-xs">F:</span> {booking.farmer}</p>
                    <p className="text-sm font-medium text-gray-900"><span className="text-gray-500 text-xs">P:</span> {booking.provider}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-black text-gray-900">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      booking.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
