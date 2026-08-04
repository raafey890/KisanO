import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Generate deep analytics and export reports.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Advanced Analytics Upcoming</h2>
        <p className="text-gray-500 font-medium">This module is currently being provisioned. Please check the Dashboard for high-level metrics.</p>
      </div>
    </div>
  );
}
