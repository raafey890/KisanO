import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Lock, Bell, Database, Mail, Server } from 'lucide-react';

const SETTINGS_CATEGORIES = [
  { id: 'general', name: 'General Settings', icon: Settings, desc: 'Platform name, logo, basic configurations' },
  { id: 'security', name: 'Security & Roles', icon: Shield, desc: 'Admin roles, permissions, 2FA enforcement' },
  { id: 'payment', name: 'Payment Gateway', icon: Lock, desc: 'Razorpay/Stripe API keys and webhook secrets' },
  { id: 'notifications', name: 'SMS & Email', icon: Mail, desc: 'Twilio, SendGrid API configurations' },
  { id: 'database', name: 'Database & Storage', icon: Database, desc: 'AWS S3 bucket details, backup frequency' },
  { id: 'maintenance', name: 'System Maintenance', icon: Server, desc: 'Maintenance mode toggle, cache clearing' },
];

export default function AdminSettings() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Configure global platform variables and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SETTINGS_CATEGORIES.map((cat) => (
          <motion.div 
            key={cat.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm cursor-pointer hover:border-purple-300 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <cat.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
              <p className="text-sm font-medium text-gray-500 mt-1 leading-relaxed">{cat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Example Form (General Settings Preview) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-sm mt-8">
        <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">General Configuration</h3>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Name</label>
              <input type="text" defaultValue="KisanO" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-purple-500 focus:ring-1 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Email</label>
              <input type="email" defaultValue="support@kisano.in" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-purple-500 focus:ring-1 transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Currency</label>
              <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-purple-500 focus:ring-1 transition-all">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="button" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
