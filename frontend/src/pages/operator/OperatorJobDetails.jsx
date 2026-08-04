import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Navigation, Clock, Phone, 
  MessageSquare, CheckCircle2, AlertTriangle, FileText, IndianRupee
} from 'lucide-react';

import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

export default function OperatorJobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock Job Data
  const job = {
    id: id || 'JOB-8821',
    status: 'Accepted',
    farmer: 'Suresh Patil',
    crop: 'Sugarcane',
    size: '5 Acres',
    service: 'Pesticide Spraying',
    date: '12 Sep 2026',
    time: '09:00 AM',
    duration: '4 Hours',
    amount: 1200,
    paymentStatus: 'Pending',
    location: 'Village Khed, Pune',
    avatar: userAvatar,
    instructions: 'Please ensure to spray evenly on the lower leaves. Avoid the perimeter near the water canal.',
    distance: '14.5 km',
    travelTime: '35 mins'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <button 
            onClick={() => navigate('/operator/jobs')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Jobs
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{job.id}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider">{job.status}</span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-2">Scheduled for {job.date} at {job.time}</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Start Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Map & Location */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-64 bg-gray-100 relative w-full flex items-center justify-center">
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
              <div className="relative z-10 flex flex-col items-center">
                <MapPin className="w-12 h-12 text-blue-500 mb-2" />
                <p className="font-bold text-gray-900">Google Maps Integration</p>
                <p className="text-sm font-medium text-gray-500">Routing to {job.location}</p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">Farm Location</h3>
                  <p className="font-medium text-gray-500">{job.location}</p>
                </div>
                <div className="flex gap-3 text-sm font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1.5"><Navigation className="w-4 h-4 text-blue-500" /> {job.distance}</span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> {job.travelTime}</span>
                </div>
              </div>
              
              <button className="w-full h-12 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-blue-200">
                <Navigation className="w-4 h-4" /> Navigate to Farm
              </button>
            </div>
          </div>

          {/* Job Requirements */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" /> Job Requirements
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Service</span>
                <p className="font-black text-gray-900">{job.service}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Crop Type</span>
                <p className="font-bold text-gray-900">{job.crop}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Field Size</span>
                <p className="font-bold text-gray-900">{job.size}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Est. Time</span>
                <p className="font-bold text-gray-900">{job.duration}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm mb-1">Special Instructions from Farmer</h4>
                <p className="text-sm font-medium text-amber-700 leading-relaxed">"{job.instructions}"</p>
              </div>
            </div>
          </div>

        </div>

        {/* SIDEBAR COLUMN */}
        <div className="space-y-8">
          
          {/* Customer Profile */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-6">Customer Profile</h3>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                <img src={job.avatar} alt={job.farmer} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-black text-gray-900">{job.farmer}</h4>
              <p className="text-sm font-medium text-gray-500 mt-1">Joined 2024 • 12 Bookings</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200">
                <Phone className="w-4 h-4" /> Call
              </button>
              <button className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-900 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="font-black mb-6 flex items-center gap-2 relative z-10">
              <IndianRupee className="w-4 h-4 text-green-400" /> Payment Summary
            </h3>
            
            <div className="space-y-4 text-sm relative z-10">
              <div className="flex justify-between items-center text-gray-300">
                <span>Base Rate ({job.size})</span>
                <span className="font-medium text-white">₹1,000</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Distance/Travel</span>
                <span className="font-medium text-white">₹200</span>
              </div>
              <div className="h-px bg-white/20 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Earnings</span>
                <span className="text-xl font-black text-green-400">₹{job.amount}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Status</span>
              <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                job.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {job.paymentStatus}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
