import React from 'react';
import { Activity, Leaf, AlertTriangle } from 'lucide-react';

export default function AdminAiReports() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">AI Plant Doctor Analytics</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Monitor usage and accuracy of the AI diagnostic tool.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">1,240</h2>
          <p className="text-xs font-bold text-gray-500 uppercase mt-2">Scans Today</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <Leaf className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">84%</h2>
          <p className="text-xs font-bold text-gray-500 uppercase mt-2">Disease Detection Rate</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">4.2%</h2>
          <p className="text-xs font-bold text-gray-500 uppercase mt-2">Failed Analyses Rate</p>
        </div>
      </div>
    </div>
  );
}
