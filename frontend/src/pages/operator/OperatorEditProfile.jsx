import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, User, MapPin, Phone, Mail, Award, Droplets } from 'lucide-react';

export default function OperatorEditProfile() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/operator/profile');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <button 
            onClick={() => navigate('/operator/profile')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Profile
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Update your personal details and service specializations.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Personal Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" /> Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                <User className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input type="text" defaultValue="Vinod Kumar" className="w-full bg-transparent text-gray-900 font-medium focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                <Phone className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input type="tel" defaultValue="+91 98765 12345" className="w-full bg-transparent text-gray-900 font-medium focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input type="email" defaultValue="vinod.sprayer@email.com" className="w-full bg-transparent text-gray-900 font-medium focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Professional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Years of Experience</label>
              <input type="number" defaultValue="5" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operating City</label>
              <input type="text" defaultValue="Pune" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Specializations (Select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Pesticide', 'Fertilizer', 'Herbicide', 'Drone Spraying'].map((spec, i) => (
                  <label key={i} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500" />
                    <span className="text-sm font-medium text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
