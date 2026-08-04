import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, User, MapPin, Briefcase, Save, Phone, Mail, IndianRupee } from 'lucide-react';

import ownerImg from '../../assets/ai/farmer_3d_icon.jpg';

export default function OwnerEditProfile() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(ownerImg);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/owner/profile');
    }, 1200);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <button 
            onClick={() => navigate('/owner/profile')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Profile
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Business Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Update your rental business information and contact details.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
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
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-black text-gray-900 mb-1">Business Logo / Profile Picture</h3>
            <p className="text-sm font-medium text-gray-500 max-w-sm mb-4">
              Upload a clear photo of yourself or your business logo to build trust with farmers.
            </p>
            <div className="flex justify-center sm:justify-start gap-3">
              <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer">
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <button 
                onClick={() => setProfileImage('')}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-red-600 font-bold text-xs rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-500" /> Business Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Name</label>
              <input type="text" defaultValue="Vikram Equipment Rentals" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Full Name</label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                <User className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input type="text" defaultValue="Vikram Desai" className="w-full bg-transparent text-gray-900 font-medium focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Phone</label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                <Phone className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input type="tel" defaultValue="+91 98765 12345" className="w-full bg-transparent text-gray-900 font-medium focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus-within:ring-1 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input type="email" defaultValue="vikram.rentals@example.com" className="w-full bg-transparent text-gray-900 font-medium focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" /> Operating Base
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Office Address / Street</label>
              <input type="text" defaultValue="Shop No. 4, Main Road" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City / Village</label>
              <input type="text" defaultValue="Pune" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
              <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none">
                <option value="MH">Maharashtra</option>
                <option value="GJ">Gujarat</option>
                <option value="KA">Karnataka</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-green-500" /> Payout Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Name</label>
              <input type="text" defaultValue="HDFC Bank" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Number</label>
              <input type="password" defaultValue="123456789" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">IFSC Code</label>
              <input type="text" defaultValue="HDFC0001234" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all uppercase" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
