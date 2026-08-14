import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShieldCheck, FileText, CheckCircle2, XCircle } from 'lucide-react';
import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

import { useAdminVerifications, useApproveVerification, useRejectVerification } from '../../features/admin/hooks/useAdmin';

export default function AdminVerifications() {
  const [search, setSearch] = useState('');

  const { data: verifications = [], isLoading } = useAdminVerifications();
  const { mutate: approveVerification } = useApproveVerification();
  const { mutate: rejectVerification } = useRejectVerification();

  const filteredVerifications = verifications.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Verification Center</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Review user identity documents and licenses.</p>
        </div>
      </div>

      {/* VERIFICATIONS LIST */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVerifications.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col group overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-black uppercase tracking-wider">{item.status}</span>
              <span className="text-xs font-bold text-gray-400">{item.date}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <img src={userAvatar} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 truncate">{item.name}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.role}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="font-bold text-sm text-gray-700">{item.type}</span>
              </div>
              <button className="text-xs font-black text-purple-600 hover:text-purple-700">View File</button>
            </div>

            <div className="mt-auto flex gap-2">
              <button 
                onClick={() => approveVerification(item.id)}
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
              <button 
                onClick={() => rejectVerification(item.id)}
                className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-red-200"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </motion.div>
        ))}
        </div>
      )}

    </div>
  );
}
