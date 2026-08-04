import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, Filter } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TXN-9842', date: '29 Jul 2026', user: 'Suresh Patil', amount: '₹12,500', type: 'Payout', status: 'Completed', method: 'Bank Transfer' },
  { id: 'TXN-9843', date: '29 Jul 2026', user: 'Anil Desai', amount: '₹4,200', type: 'Booking Fee', status: 'Completed', method: 'UPI' },
  { id: 'TXN-9844', date: '28 Jul 2026', user: 'Ramesh Kumar', amount: '₹1,500', type: 'Marketplace', status: 'Pending', method: 'Credit Card' },
  { id: 'TXN-9845', date: '28 Jul 2026', user: 'Vikram Singh', amount: '₹8,900', type: 'Payout', status: 'Failed', method: 'Bank Transfer' },
];

export default function AdminPayments() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans pb-32 pt-6 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Financial Overview</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage revenue, payouts, and platform transactions.</p>
        </div>
        <button className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto shrink-0">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-500 text-sm">Total Revenue (Month)</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹8,45,200</h2>
          <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">+12.5% from last month</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-500 text-sm">Pending Payouts</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹1,12,000</h2>
          <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1">24 requests pending</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-500 text-sm">Platform Commission</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹42,260</h2>
          <p className="text-xs font-bold text-purple-600 mt-2 flex items-center gap-1">5% avg take rate</p>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-gray-900">Recent Transactions</h2>
          <button className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700 font-bold text-sm shrink-0 w-fit">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Type / Method</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-gray-900 text-sm">{txn.id}</p>
                    <p className="text-xs font-medium text-gray-500">{txn.date}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-sm">
                    {txn.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-gray-900 text-sm">{txn.type}</p>
                    <p className="text-xs font-medium text-gray-500">{txn.method}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-black text-gray-900">
                    {txn.type === 'Payout' ? <span className="text-red-500">-{txn.amount}</span> : <span className="text-green-500">+{txn.amount}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      txn.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      txn.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
