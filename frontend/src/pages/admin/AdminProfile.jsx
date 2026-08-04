import React from 'react';
import { User, Shield } from 'lucide-react';

export default function AdminProfile() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Admin Profile</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Manage your administrative account settings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-3xl shrink-0">
          AD
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Super Admin</h2>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
            <Shield className="w-4 h-4 text-green-500" />
            Full System Access
          </p>
        </div>
      </div>
    </div>
  );
}
