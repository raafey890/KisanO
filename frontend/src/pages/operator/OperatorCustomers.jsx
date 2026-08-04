import React from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, MessageSquare, Star, MapPin, History, ChevronRight } from 'lucide-react';

import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

const CUSTOMERS = [
  { id: 1, name: 'Suresh Patil', location: 'Village Khed', phone: '+91 98765 43210', jobs: 12, rating: 5.0, lastJob: '12 Sep 2026', type: 'Repeat' },
  { id: 2, name: 'Anil Desai', location: 'Village Shirur', phone: '+91 87654 32109', jobs: 5, rating: 4.8, lastJob: '10 Sep 2026', type: 'Repeat' },
  { id: 3, name: 'Ramesh Kumar', location: 'Village Baramati', phone: '+91 76543 21098', jobs: 1, rating: 4.5, lastJob: '05 Sep 2026', type: 'New' },
  { id: 4, name: 'Vikram Singh', location: 'Pune City', phone: '+91 65432 10987', jobs: 3, rating: 5.0, lastJob: '28 Aug 2026', type: 'Repeat' },
];

export default function OperatorCustomers() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">My Customers</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage your relationships with farmers.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* CUSTOMER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CUSTOMERS.map((customer) => (
          <motion.div 
            key={customer.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[2rem] border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                  <img src={userAvatar} alt={customer.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{customer.name}</h3>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {customer.location}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                customer.type === 'Repeat' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {customer.type}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Jobs</span>
                <p className="font-black text-gray-900">{customer.jobs}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Avg Rating</span>
                <p className="font-black text-gray-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {customer.rating}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Last Job</span>
                <p className="font-black text-gray-900 text-sm">{customer.lastJob}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200">
                <Phone className="w-4 h-4" /> Call
              </button>
              <button className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              <button className="w-12 h-12 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors flex items-center justify-center border border-blue-100">
                <History className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
