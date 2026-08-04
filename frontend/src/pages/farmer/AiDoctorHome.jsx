import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Upload, History, Info, Scan, Leaf, 
  Activity, ArrowRight, ShieldCheck, Zap, HelpCircle, AlertTriangle
} from 'lucide-react';

import aiHeroImg from '../../assets/ai/ai_hero.jpg';

// Mock recent scans
const RECENT_SCANS = [
  { id: 'SCN-101', date: 'Yesterday', crop: 'Cotton', disease: 'Leaf Blight', severity: 'High', color: 'bg-red-100 text-red-700' },
  { id: 'SCN-102', date: '3 days ago', crop: 'Tomato', disease: 'Healthy', severity: 'None', color: 'bg-green-100 text-green-700' },
];

export default function AiDoctorHome() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-10 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-4 sm:pt-8">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-black uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 fill-current" /> Powered by KisanO AI
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              AI Plant Doctor
            </h1>
            <p className="text-lg sm:text-xl font-medium text-gray-500 mt-4 leading-relaxed max-w-lg">
              Instantly identify crop diseases, check severity, and get expert treatment recommendations just by taking a photo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={() => navigate('/farmer/ai-doctor/upload')}
              className="h-14 px-8 bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Take Photo
            </button>
            <button 
              onClick={() => navigate('/farmer/ai-doctor/upload')}
              className="h-14 px-8 bg-white hover:bg-gray-50 text-gray-700 font-bold text-base rounded-2xl transition-colors border-2 border-gray-200 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" /> Upload Image
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-gray-100"
        >
          <img src={aiHeroImg} alt="AI Plant Doctor Scanning Crop" className="w-full h-full object-cover" />
          {/* Decorative scanning overlay line */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-green-400 shadow-[0_0_15px_rgba(7ade80,0.8)] z-10"
          ></motion.div>
        </motion.div>
      </div>

      {/* 2. HOW IT WORKS */}
      <div className="py-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-green-600" /> How AI Doctor Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-4 hover:border-green-300 transition-colors">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">1. Take a Photo</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">Capture a clear picture of the affected leaf or crop part.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-4 hover:border-green-300 transition-colors">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">2. AI Analysis</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">Our advanced AI instantly scans and identifies the specific disease.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-4 hover:border-green-300 transition-colors">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">3. Get Treatment</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">Receive expert chemical and organic treatment recommendations.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. RECENT SCANS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <History className="w-6 h-6 text-gray-400" /> Recent Scans
            </h2>
            <button 
              onClick={() => navigate('/farmer/ai-doctor/history')}
              className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RECENT_SCANS.map(scan => (
              <div key={scan.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 cursor-pointer" onClick={() => navigate(`/farmer/ai-doctor/result/${scan.id}`)}>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-400">{scan.date}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${scan.color}`}>
                    {scan.severity}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 text-lg flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-green-500" /> {scan.crop}
                  </h4>
                  <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-gray-400" /> {scan.disease}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. HELP & FAQ WIDGET */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-gray-400" /> Support
          </h2>
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">AI Limitations</h4>
                <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                  The AI is highly accurate but serves as an assistant. Always cross-check severe cases with a local agronomist.
                </p>
              </div>
            </div>
            <hr className="border-gray-200" />
            <button className="w-full text-left py-2 text-sm font-bold text-gray-700 hover:text-green-600 transition-colors flex justify-between items-center">
              Frequently Asked Questions <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full text-left py-2 text-sm font-bold text-gray-700 hover:text-green-600 transition-colors flex justify-between items-center">
              Supported Crops List <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
