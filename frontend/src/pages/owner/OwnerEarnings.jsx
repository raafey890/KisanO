import React from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, TrendingUp, Download, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, Clock
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TXN-9938', date: '12 Sep 2026', type: 'Credit', amount: 1600, status: 'Completed', title: 'Booking BK-7829', user: 'Suresh Patil' },
  { id: 'TXN-9939', date: '15 Sep 2026', type: 'Credit', amount: 2500, status: 'Pending', title: 'Booking BK-7830', user: 'Ramesh Kumar' },
  { id: 'TXN-9940', date: '01 Sep 2026', type: 'Debit', amount: 450, status: 'Completed', title: 'Platform Fee (Aug)', user: 'KisanO' },
  { id: 'TXN-9941', date: '28 Aug 2026', type: 'Credit', amount: 3200, status: 'Completed', title: 'Booking BK-7801', user: 'Anil Desai' },
];

export default function OwnerEarnings() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Earnings</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Track your income, view analytics, and manage payouts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <p className="text-sm font-bold text-gray-400 mb-2">Available for Withdrawal</p>
          <h2 className="text-4xl font-black mb-1">₹12,450</h2>
          <div className="flex items-center gap-1 text-xs font-bold text-green-400 mt-4">
            <CheckCircle2 className="w-3.5 h-3.5" /> All payments cleared
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Monthly Earnings</p>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><IndianRupee className="w-4 h-4" /></div>
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹45,200</h2>
          <div className="flex items-center gap-1 text-xs font-bold text-green-600 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +14.5% from last month
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Pending Payments</p>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock className="w-4 h-4" /></div>
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹2,500</h2>
          <div className="text-xs font-bold text-gray-400 mt-2">
            Expected clearance in 1-2 days
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Yearly Earnings</p>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><IndianRupee className="w-4 h-4" /></div>
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹3.2L</h2>
          <div className="text-xs font-bold text-gray-400 mt-2">
            Year to Date (YTD)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. CHART & ANALYTICS (MOCK) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Income Trend (Last 6 Months)
            </h2>
            
            {/* CSS Mock Chart */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 border-b border-gray-100 pb-4 relative">
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] font-bold text-gray-300 w-8">
                <span>50k</span>
                <span>30k</span>
                <span>10k</span>
                <span>0</span>
              </div>

              <div className="w-8"></div> {/* Spacer for Y-axis */}

              {/* Chart Bars */}
              {[
                { month: 'Apr', height: '60%' },
                { month: 'May', height: '45%' },
                { month: 'Jun', height: '80%' },
                { month: 'Jul', height: '70%' },
                { month: 'Aug', height: '90%' },
                { month: 'Sep', height: '55%' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(parseInt(bar.height) * 500).toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[3rem] bg-amber-100 group-hover:bg-amber-300 transition-colors rounded-t-xl relative overflow-hidden"
                    style={{ height: bar.height }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-500 h-2"></div>
                  </div>
                  <span className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-wider">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. RECENT TRANSACTIONS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">Transactions</h2>
            <button className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">View All</button>
          </div>
          
          <div className="space-y-4 flex-1">
            {TRANSACTIONS.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    txn.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {txn.type === 'Credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5">{txn.title}</h4>
                    <p className="text-xs font-medium text-gray-500">{txn.date} • {txn.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-black flex items-center justify-end ${
                    txn.type === 'Credit' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    txn.status === 'Completed' ? 'text-green-500' : 'text-orange-500'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
