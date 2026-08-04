import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Mail, ShieldCheck, 
  Droplets, Award, Star, Edit3, Briefcase, Settings, HelpCircle, FileText
} from 'lucide-react';

import operatorAvatar from '../../assets/ai/farmer_3d_icon.jpg'; 

export default function OperatorProfile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Operator Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage your business details, experience and equipment.</p>
        </div>
        
        <button 
          onClick={() => navigate('/operator/profile/edit')}
          className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl shrink-0 relative z-10">
            <img src={operatorAvatar} alt="Operator Profile" className="w-full h-full object-cover" />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="text-center sm:text-left relative z-10 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Vinod Kumar</h2>
                <p className="text-lg font-bold text-gray-500 mb-4 flex items-center justify-center sm:justify-start gap-2">
                  Professional Sprayer <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 5 Yrs Exp
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex flex-col items-center sm:items-end text-center sm:text-right">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Top Rated</span>
                <span className="text-lg font-black text-gray-900 flex items-center gap-1">
                  4.9 <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <MapPin className="w-4 h-4 text-blue-500" /> Pune, Maharashtra
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <Phone className="w-4 h-4 text-green-500" /> +91 98765 12345
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <Mail className="w-4 h-4 text-purple-500" /> vinod.sprayer@email.com
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Aadhaar Verified
              </div>
            </div>
          </div>
        </div>

        {/* Business & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Specializations
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">Pesticide Spraying</span>
                <span className="px-3 py-1.5 bg-green-50 text-green-700 font-bold text-xs rounded-lg border border-green-100">Fertilizer Application</span>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg border border-purple-100">Herbicide Treatment</span>
                <span className="px-3 py-1.5 bg-orange-50 text-orange-700 font-bold text-xs rounded-lg border border-orange-100">Drone Spraying (Certified)</span>
              </div>
              
              <div className="h-px bg-gray-100 my-4"></div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">Completed Jobs</span>
                  <span className="text-sm font-black text-gray-900">420+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">Total Area Covered</span>
                  <span className="text-sm font-black text-gray-900">1,500+ Acres</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" /> Equipment Owned
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 shrink-0">
                  <Droplets className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">ASPEE HTP Tractor Sprayer</h4>
                  <p className="text-xs font-medium text-gray-500">400 L Capacity • Good Condition</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 shrink-0">
                  <Droplets className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Knapsack Battery Sprayer</h4>
                  <p className="text-xs font-medium text-gray-500">16 L Capacity • Maintained</p>
                </div>
              </div>
              <button className="w-full py-3 bg-white border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-500 hover:text-blue-600 font-bold text-sm rounded-xl transition-colors">
                + Add Equipment
              </button>
            </div>
          </div>

        </div>

        {/* Bank & Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 text-gray-700">
            <FileText className="w-6 h-6 text-gray-400" />
            <span className="font-bold text-sm">Bank Details</span>
          </button>
          <button className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 text-gray-700">
            <Settings className="w-6 h-6 text-gray-400" />
            <span className="font-bold text-sm">Account Settings</span>
          </button>
          <button className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 text-gray-700">
            <HelpCircle className="w-6 h-6 text-gray-400" />
            <span className="font-bold text-sm">Help & Support</span>
          </button>
        </div>

      </div>
    </div>
  );
}
