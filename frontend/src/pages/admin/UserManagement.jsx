import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import userAvatar from '../../assets/ai/farmer_3d_icon.jpg';
import { useAdminUsers, useSuspendUser } from '../../features/admin/hooks/useAdmin';

const TABS = ['All Users', 'Farmers', 'Equipment Owners', 'Sprayer Operators', 'Admins'];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('All Users');
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useAdminUsers();
  const { mutate: suspendUser } = useSuspendUser();

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'All Users' || user.role === (
      activeTab === 'Farmers' ? 'Farmer' : 
      activeTab === 'Equipment Owners' ? 'Equipment Owner' : 
      activeTab === 'Sprayer Operators' ? 'Sprayer Operator' : 'Admin'
    );
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage and monitor all platform accounts.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
              className="w-full h-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-sm"
            />
          </div>
          <button className="h-12 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-gray-700 font-bold text-sm shrink-0">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* USERS TABLE / CARDS */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        <img src={userAvatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          {user.name}
                          {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                        </p>
                        <p className="text-xs font-medium text-gray-500">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Farmer' ? 'bg-green-100 text-green-700' :
                      user.role === 'Equipment Owner' ? 'bg-orange-100 text-orange-700' :
                      'bg-cyan-100 text-cyan-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                    <p className="text-xs font-medium text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                      user.status === 'Active' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {user.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                    {user.status !== 'Suspended' && (
                      <button 
                        onClick={() => suspendUser(user.id)}
                        className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                      >
                        Suspend
                      </button>
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-500">
          <span>Showing 4 of 16,500 users</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors bg-gray-100 text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors bg-white text-gray-700 font-bold shadow-sm">Next</button>
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
