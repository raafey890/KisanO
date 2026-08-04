import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Trash2, Camera } from 'lucide-react';

import tractorImg from '../../assets/ai/ai_hero.jpg';

export default function EditEquipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/owner/equipment');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <button 
            onClick={() => navigate('/owner/equipment')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <ChevronLeft className="w-5 h-5" /> Cancel
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Edit Equipment</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Update details for Mahindra 575 DI XP Plus</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 w-12 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-xl flex items-center justify-center transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Cover Photo */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden relative group">
            <img src={tractorImg} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg font-black text-gray-900 mb-1">Cover Photo</h3>
            <p className="text-sm font-medium text-gray-500 mb-4">This is the first image farmers will see.</p>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors">
              Change Image
            </button>
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
              <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none">
                <option value="Available" selected>Available</option>
                <option value="Maintenance">Under Maintenance</option>
                <option value="Paused">Paused (Hidden)</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Equipment Name</label>
              <input type="text" defaultValue="Mahindra 575 DI XP Plus" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
              <textarea rows={4} defaultValue="Perfect for medium to large farms. Regularly serviced." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6">Pricing & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Price (₹)</label>
              <input type="number" defaultValue="800" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
              <input type="text" defaultValue="Shirur, Pune" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
