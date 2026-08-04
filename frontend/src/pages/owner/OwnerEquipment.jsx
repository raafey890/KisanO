import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Tractor, Plus, Search, Filter, MoreVertical, 
  MapPin, Star, Activity, Edit3, Trash2, PauseCircle,
  Eye, IndianRupee, Image as ImageIcon
} from 'lucide-react';

import tractorImg from '../../assets/ai/ai_hero.jpg'; 
import harvesterImg from '../../assets/ai/ai_hero.jpg';

const EQUIPMENT_DATA = [
  {
    id: 1,
    name: 'Mahindra 575 DI XP Plus',
    category: 'Tractor',
    brand: 'Mahindra',
    price: 800,
    status: 'Available',
    location: 'Shirur, Pune',
    rating: 4.8,
    bookings: 45,
    utilization: 78,
    image: tractorImg,
    galleryCount: 4
  },
  {
    id: 2,
    name: 'John Deere W70',
    category: 'Harvester',
    brand: 'John Deere',
    price: 2500,
    status: 'Rented Out',
    location: 'Shirur, Pune',
    rating: 4.9,
    bookings: 22,
    utilization: 92,
    image: harvesterImg,
    galleryCount: 6
  },
  {
    id: 3,
    name: 'Sonalika Rotavator 6 Feet',
    category: 'Implement',
    brand: 'Sonalika',
    price: 400,
    status: 'Maintenance',
    location: 'Shirur, Pune',
    rating: 4.5,
    bookings: 18,
    utilization: 45,
    image: tractorImg, // Using same for placeholder
    galleryCount: 2
  }
];

export default function OwnerEquipment() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rented Out': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUtilizationColor = (percent) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">My Equipment</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage your fleet, track utilization, and update listings.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors flex items-center justify-center shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/owner/equipment/add')}
            className="h-12 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by equipment name, brand or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-all"
        />
      </div>

      {/* 3. EQUIPMENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {EQUIPMENT_DATA.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            
            {/* Image Section */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black border backdrop-blur-md bg-white/90 ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> {item.galleryCount} Photos
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{item.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-bold text-gray-500">{item.brand}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{item.name}</h3>
                </div>
                
                {/* Options Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenu === item.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden"
                        >
                          <button onClick={() => navigate(`/owner/equipment/edit/${item.id}`)} className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-blue-500" /> Edit Details
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <PauseCircle className="w-4 h-4 text-orange-500" /> Pause Listing
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1 pt-3">
                            <Trash2 className="w-4 h-4" /> Delete Equipment
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Price & Location */}
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-gray-900 flex items-center"><IndianRupee className="w-5 h-5" />{item.price}</span>
                  <span className="text-sm font-bold text-gray-500 mb-1">/ day</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" /> {item.location}
                </div>
              </div>

              <hr className="my-5 border-gray-100" />

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">RATING & BOOKINGS</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm font-black text-gray-900">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {item.rating}
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-bold text-gray-500">{item.bookings} total</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                    UTILIZATION <Activity className="w-3 h-3" />
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-900">{item.utilization}%</span>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getUtilizationColor(item.utilization)}`} style={{ width: `${item.utilization}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 h-10 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button className="flex-1 h-10 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> Analytics
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
