import React from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, TrendingUp, Download, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownRight, Droplets
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TXN-9938', date: '12 Sep', amount: 1200, status: 'completed', farmer: 'Suresh Patil', type: 'Pesticide' },
  { id: 'TXN-9937', date: '11 Sep', amount: 850, status: 'completed', farmer: 'Anil Desai', type: 'Herbicide' },
  { id: 'TXN-9936', date: '09 Sep', amount: 2500, status: 'completed', farmer: 'Ramesh Kumar', type: 'Fertilizer' },
  { id: 'TXN-9935', date: '05 Sep', amount: 900, status: 'pending', farmer: 'Kishore J', type: 'Pesticide' },
];

export default function OperatorEarnings() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Earnings Dashboard</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Track your spraying income and payment history.</p>
        </div>
        
        <button className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
          Withdraw ₹12,450
        </button>
      </div>

      {/* 2. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Today's Earnings", value: '₹1,200', trend: '+15%', up: true, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Weekly Earnings', value: '₹8,450', trend: '+5%', up: true, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Monthly Earnings', value: '₹28,500', trend: '+22%', up: true, bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Pending Payouts', value: '₹2,100', trend: '-2%', up: false, bg: 'bg-red-50', color: 'text-red-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -mr-10 -mt-10 ${stat.bg}`}></div>
            <p className="text-xs sm:text-sm font-bold text-gray-500 mb-2 relative z-10">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 relative z-10 tracking-tight">{stat.value}</p>
            <div className="flex items-center gap-1.5 relative z-10">
              <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                stat.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {stat.trend}
              </span>
              <span className="text-xs font-medium text-gray-400">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. CHARTS AREA */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Income Trend (Last 7 Days)
              </h2>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2 outline-none cursor-pointer">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            
            {/* Pure CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-gray-100 pb-2">
              {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-blue-100 group-hover:bg-blue-200 rounded-t-lg relative transition-colors"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{height * 30}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. RECENT TRANSACTIONS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">Transactions</h2>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar pr-2">
            {TRANSACTIONS.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    txn.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {txn.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{txn.farmer}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-gray-500">{txn.date}</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{txn.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">₹{txn.amount}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    txn.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                  }`}>{txn.status}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-bold text-sm rounded-xl transition-colors">
            View All History
          </button>
        </div>

      </div>
    </div>
  );
}
