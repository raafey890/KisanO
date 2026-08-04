import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Box, Store, Search, Filter, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import seedImg from '../../assets/ai/ai_hero.jpg';

const PRODUCTS = [
  { id: 'PRD-01', name: 'Premium Wheat Seeds', seller: 'AgriCorp', category: 'Seeds', stock: 150, price: '₹1,200', status: 'Pending' },
  { id: 'PRD-02', name: 'Organic Fertilizer', seller: 'GreenLife', category: 'Fertilizer', stock: 45, price: '₹800', status: 'Active' },
  { id: 'PRD-03', name: 'Neem Pesticide', seller: 'BioSafe', category: 'Pesticide', stock: 0, price: '₹450', status: 'Out of Stock' },
];

export default function AdminMarketplace() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Marketplace Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage products, approvals, and inventory.</p>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PRODUCTS.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col group overflow-hidden"
          >
            <div className="flex gap-4 mb-5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                <img src={seedImg} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm font-medium text-gray-500 truncate">by {item.seller}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</span>
                <span className="font-black text-gray-900 text-sm">{item.price}</span>
              </div>
              <div className="text-center border-l border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Stock</span>
                <span className="font-black text-gray-900 text-sm">{item.stock}</span>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              {item.status === 'Pending' ? (
                <>
                  <button className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors border border-red-200">
                    Reject
                  </button>
                </>
              ) : (
                <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors border border-gray-200">
                  Manage Product
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
