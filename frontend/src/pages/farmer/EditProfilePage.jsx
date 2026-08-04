import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, User, MapPin, Sprout, Save, Phone, Mail, FileText, Languages } from 'lucide-react';

import farmerImg from '../../assets/ai/farmer_3d_icon.jpg';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/farmer/profile');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <button 
            onClick={() => navigate('/farmer/profile')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Profile
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Update your personal and farm information.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">Saving...</span>
          ) : (
            <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
          )}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Profile Photo */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
              <img src={farmerImg} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-black text-gray-900 mb-1">Profile Picture</h3>
            <p className="text-sm font-medium text-gray-500 max-w-sm mb-4">
              Upload a clear photo of yourself to help providers and buyers identify you.
            </p>
            <div className="flex justify-center sm:justify-start gap-3">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors">
                Change Photo
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-red-600 font-bold text-xs rounded-lg transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" /> Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input type="text" defaultValue="Ramesh Kumar" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input type="email" defaultValue="ramesh.k@example.com" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" /> Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Farm Address / Street</label>
              <input type="text" defaultValue="Gat No. 45, Near Hanuman Temple" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Village / Town</label>
              <input type="text" defaultValue="Shirur" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">District</label>
              <input type="text" defaultValue="Pune" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
              <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all appearance-none">
                <option value="MH">Maharashtra</option>
                <option value="GJ">Gujarat</option>
                <option value="KA">Karnataka</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">PIN Code</label>
              <input type="text" defaultValue="412210" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Farm & Preferences */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-500" /> Farm Details & Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Farm Size (Acres)</label>
              <input type="number" defaultValue="12" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Language</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Languages className="w-4 h-4 text-gray-400" />
                </div>
                <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all appearance-none">
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr" selected>Marathi (मराठी)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Crops Grown</label>
              <textarea rows={3} defaultValue="Cotton, Sugarcane, Wheat" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
