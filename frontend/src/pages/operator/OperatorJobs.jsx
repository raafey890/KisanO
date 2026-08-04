import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, CheckCircle2, XCircle, Phone, 
  MessageSquare, CalendarDays, Clock, MapPin, IndianRupee,
  PlayCircle
} from 'lucide-react';

import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';

const TABS = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

const MOCK_JOBS = [
  {
    id: 'JOB-8821',
    status: 'Pending',
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
    avatar: userAvatar
  },
  {
    id: 'JOB-8822',
    status: 'Accepted',
    farmer: 'Ramesh Kumar',
    crop: 'Cotton',
    size: '10 Acres',
    service: 'Fertilizer Application',
    date: '13 Sep 2026',
    time: '10:30 AM',
    duration: '8 Hours',
    amount: 2500,
    paymentStatus: 'Paid',
    location: 'Village Shirur, Pune',
    avatar: userAvatar
  },
  {
    id: 'JOB-8823',
    status: 'In Progress',
    farmer: 'Anil Desai',
    crop: 'Wheat',
    size: '3 Acres',
    service: 'Herbicide Spraying',
    date: 'Today',
    time: '08:00 AM',
    duration: '2 Hours',
    amount: 800,
    paymentStatus: 'Pending',
    location: 'Village Baramati, Pune',
    avatar: userAvatar
  }
];

export default function OperatorJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pending');
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const filteredJobs = jobs.filter(j => j.status === activeTab);

  const handleStatusChange = (id, newStatus) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Job Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage your spraying service requests and active jobs.</p>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200">
        {TABS.map(tab => {
          const count = jobs.filter(j => j.status === tab).length;
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-blue-600 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 3. JOBS LIST */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div 
                key={job.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-6">
                  
                  {/* Farmer Details */}
                  <div className="w-full lg:w-1/3 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-white shadow-sm">
                      <img src={job.avatar} alt="Farmer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1 block">Customer</span>
                      <h3 className="text-lg font-black text-gray-900 leading-tight">{job.farmer}</h3>
                      <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </p>
                      
                      {/* Contact Actions */}
                      <div className="flex gap-2 mt-4">
                        <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 relative">
                    
                    {/* Top Row */}
                    <div className="col-span-2 sm:col-span-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Service Required</span>
                      <p className="font-black text-gray-900 text-lg">{job.service}</p>
                    </div>

                    {/* Stats */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Crop</span>
                      <p className="font-bold text-gray-700 text-sm">{job.crop}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Field Size</span>
                      <p className="font-bold text-gray-700 text-sm">{job.size}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Date & Time</span>
                      <p className="font-bold text-gray-700 text-sm">{job.date} <span className="text-gray-400 font-medium">| {job.time}</span></p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Duration</span>
                      <p className="font-bold text-gray-700 text-sm">{job.duration}</p>
                    </div>

                    {/* Divider */}
                    <div className="col-span-2 sm:col-span-4 h-px bg-gray-200 my-1"></div>

                    {/* Financials */}
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Estimated Earnings</span>
                      <p className="font-black text-green-600 flex items-center text-lg"><IndianRupee className="w-4 h-4" /> {job.amount}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        Payment: {job.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-48 flex flex-col justify-center gap-3">
                    {job.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(job.id, 'Accepted')}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept Job
                        </button>
                        <button 
                          onClick={() => handleStatusChange(job.id, 'Cancelled')}
                          className="w-full h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-red-200"
                        >
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </>
                    )}
                    {job.status === 'Accepted' && (
                      <button 
                        onClick={() => handleStatusChange(job.id, 'In Progress')}
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" /> Start Job
                      </button>
                    )}
                    {job.status === 'In Progress' && (
                      <button 
                        onClick={() => handleStatusChange(job.id, 'Completed')}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Complete
                      </button>
                    )}
                    {['Completed', 'Cancelled'].includes(job.status) && (
                      <div className={`px-4 py-3 rounded-xl text-center font-bold text-sm border ${
                        job.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {job.status}
                      </div>
                    )}
                    <button 
                      onClick={() => navigate(`/operator/jobs/${job.id}`)}
                      className="w-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mt-2"
                    >
                      View Full Details
                    </button>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner mb-6 border-4 border-white">
                <ClipboardList className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No {activeTab.toLowerCase()} jobs</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-6">
                You don't have any spraying requests in this category right now. Keep your availability on!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
