import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Leaf, Activity, Calendar, 
  Trash2, Eye, RefreshCw, ChevronLeft, Scan
} from 'lucide-react';

const MOCK_SCANS = [
  {
    id: 'SCN-101',
    date: '28 Jul 2026',
    crop: 'Cotton',
    disease: 'Leaf Blight',
    severity: 'High',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'SCN-102',
    date: '25 Jul 2026',
    crop: 'Tomato',
    disease: 'Healthy',
    severity: 'None',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    id: 'SCN-103',
    date: '20 Jul 2026',
    crop: 'Sugarcane',
    disease: 'Red Rot',
    severity: 'Medium',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  }
];

export default function AiDoctorHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [scans, setScans] = useState(MOCK_SCANS);

  const filteredScans = scans.filter(scan => 
    scan.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
    scan.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setScans(scans.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <div className="flex flex-col gap-6 pt-2 sm:pt-4">
        
        <button 
          onClick={() => navigate('/farmer/ai-doctor')}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-5 h-5" /> Back to AI Home
        </button>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Scan History
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500 mt-2">
            Access and manage all your previous AI plant diagnoses.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:flex-1 flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-green-500 focus-within:shadow-sm transition-all group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 font-medium ml-3 w-full"
              placeholder="Search by crop or disease name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="w-full sm:w-auto h-14 px-6 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      {/* 2. SCANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredScans.length > 0 ? (
            filteredScans.map(scan => (
              <motion.div 
                key={scan.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-100 relative">
                  <Leaf className="w-12 h-12 text-gray-300" />
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${scan.color}`}>
                    {scan.severity} Severity
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">{scan.date}</span>
                      <span className="text-xs font-black text-gray-300">{scan.id}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mt-1">
                      {scan.crop}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-gray-400" /> {scan.disease}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => navigate(`/farmer/ai-doctor/result/${scan.id}`)}
                      className="flex-1 h-10 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" /> View Report
                    </button>
                    <button 
                      onClick={() => navigate('/farmer/ai-doctor/upload')}
                      className="flex-1 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
                    >
                      <RefreshCw className="w-4 h-4" /> Retest
                    </button>
                    <button 
                      onClick={() => handleDelete(scan.id)}
                      className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex items-center justify-center shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner mb-6">
                <Scan className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No scans found</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-8">
                {searchQuery 
                  ? "We couldn't find any scans matching your search." 
                  : "You haven't scanned any plants yet."}
              </p>
              <button 
                onClick={() => navigate('/farmer/ai-doctor/upload')}
                className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
              >
                Scan a Plant
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
