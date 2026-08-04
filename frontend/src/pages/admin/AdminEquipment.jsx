import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Tractor, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import equipmentImg from '../../assets/ai/ai_hero.jpg';

const EQUIPMENT = [
  { id: 'EQ-1001', name: 'John Deere 5310', owner: 'Suresh Patil', category: 'Tractor', price: '₹800/hr', status: 'Pending', rating: 0, utilization: '0%' },
  { id: 'EQ-1002', name: 'Mahindra Arjun Novo', owner: 'Anil Desai', category: 'Tractor', price: '₹850/hr', status: 'Active', rating: 4.8, utilization: '75%' },
  { id: 'EQ-1003', name: 'Automatic Seed Drill', owner: 'Ramesh Kumar', category: 'Implement', price: '₹300/hr', status: 'Active', rating: 4.5, utilization: '40%' },
];

export default function AdminEquipment() {
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Equipment Listings</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Review and manage all machinery on the platform.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search equipment..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
              className="w-full h-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-sm"
            />
          </div>
          <button className="h-12 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-gray-700 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* EQUIPMENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {EQUIPMENT.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col group overflow-hidden"
          >
            <div className="flex gap-4 mb-5 relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 relative">
                <img src={equipmentImg} alt={item.name} className="w-full h-full object-cover" />
                {item.status === 'Pending' && (
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase text-white bg-amber-500 px-2 py-1 rounded-md">Review</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm font-medium text-gray-500 truncate">by {item.owner}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</span>
                <span className="font-black text-gray-900 text-sm">{item.price}</span>
              </div>
              <div className="text-center border-l border-r border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Rating</span>
                <span className="font-black text-gray-900 text-sm">{item.rating || 'N/A'}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Utilization</span>
                <span className="font-black text-gray-900 text-sm">{item.utilization}</span>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              {item.status === 'Pending' ? (
                <>
                  <button className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-red-200">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              ) : (
                <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors border border-gray-200">
                  Manage Listing
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
