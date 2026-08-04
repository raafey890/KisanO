import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Tractor, IndianRupee, MapPin, 
  Image as ImageIcon, FileText, CheckCircle2, UploadCloud,
  X, AlertCircle
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Tractor },
  { id: 2, title: 'Pricing', icon: IndianRupee },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Photos', icon: ImageIcon },
  { id: 5, title: 'Documents', icon: FileText },
  { id: 6, title: 'Review', icon: CheckCircle2 },
];

export default function AddEquipment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      navigate('/owner/equipment');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/owner/equipment')}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
        >
          <ChevronLeft className="w-5 h-5" /> Cancel
        </button>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Add New Equipment</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">List your machinery and start earning today.</p>
      </div>

      {/* 2. PROGRESS BAR */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0">
            <motion.div 
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive ? 'border-amber-500 bg-amber-50 text-amber-600' : 
                  isCompleted ? 'border-amber-500 bg-amber-500 text-white' : 
                  'border-gray-200 bg-white text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                  isActive ? 'text-amber-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. STEP CONTENT */}
      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 sm:p-10 mb-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Equipment Name</label>
                  <input type="text" placeholder="e.g. Mahindra 575 DI XP Plus" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none">
                    <option>Tractor</option>
                    <option>Harvester</option>
                    <option>Implement (Rotavator, Cultivator)</option>
                    <option>Sprayer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</label>
                  <input type="text" placeholder="e.g. Mahindra" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea rows={4} placeholder="Describe the condition, features, and capabilities of the equipment..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PRICING */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Rental Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Rental Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee className="w-5 h-5 text-gray-400" /></div>
                    <input type="number" placeholder="0.00" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 text-gray-900 font-black text-lg focus:outline-none focus:border-amber-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weekly Price (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee className="w-5 h-5 text-gray-400" /></div>
                    <input type="number" placeholder="0.00" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 text-gray-900 font-black text-lg focus:outline-none focus:border-amber-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Deposit</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee className="w-5 h-5 text-gray-400" /></div>
                    <input type="number" placeholder="0.00" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 text-gray-900 font-black text-lg focus:outline-none focus:border-amber-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operating Radius (KM)</label>
                  <input type="number" placeholder="e.g. 50" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 transition-all" />
                  <p className="text-xs text-gray-400 font-medium">How far are you willing to deliver/operate?</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Equipment Location</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Street Address / Village</label>
                  <input type="text" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">District</label>
                  <input type="text" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">PIN Code</label>
                  <input type="text" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:border-amber-500 transition-all" />
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-64 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <MapPin className="w-10 h-10 text-amber-500 mb-2" />
                  <p className="font-bold text-gray-700">Pin Location on Map</p>
                  <p className="text-xs font-medium text-gray-500">Google Maps API integration goes here</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PHOTOS */}
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Upload Photos</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">Listings with high-quality photos get 3x more bookings.</p>
              
              <div className="w-full border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:bg-amber-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Drag & drop photos here</h3>
                <p className="text-sm font-medium text-gray-500 mb-6">or click to browse from your device</p>
                <button className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors shadow-lg">
                  Select Images
                </button>
              </div>

              {/* Gallery UI Placeholder */}
              <div className="pt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Uploaded Photos (0)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {/* Skeletons for empty state */}
                  {[1,2,3].map(i => (
                    <div key={i} className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 border-dashed">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: DOCUMENTS */}
          {currentStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 text-sm mb-1">Why upload documents?</h3>
                  <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    Verified documents protect your equipment during rentals and build trust with farmers. These are kept completely secure and private.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {['Registration Certificate (RC)', 'Insurance Document', 'Latest Service Certificate (Optional)'].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{doc}</span>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-colors">
                      Upload
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6: REVIEW */}
          {currentStep === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Ready to Publish!</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                Your equipment listing is complete. Review your details below or publish it immediately to the marketplace.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-3xl text-left border border-gray-100 mb-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Tractor className="w-4 h-4 text-amber-500" /> Listing Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Name</span>
                    <span className="font-bold text-gray-900">Mahindra 575 DI XP Plus</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Price</span>
                    <span className="font-bold text-gray-900">₹800 / day</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Location</span>
                    <span className="font-bold text-gray-900">Shirur, Pune</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Status</span>
                    <span className="font-bold text-green-600">Available</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 4. FOOTER CONTROLS */}
      <div className="flex items-center justify-between">
        <button 
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`h-14 px-6 sm:px-8 font-bold text-sm rounded-xl transition-all flex items-center gap-2 ${
            currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
          }`}
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        {currentStep < STEPS.length ? (
          <button 
            onClick={nextStep}
            className="h-14 px-8 sm:px-10 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center gap-2"
          >
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="h-14 px-8 sm:px-12 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {isPublishing ? 'Publishing...' : 'Publish Listing'}
          </button>
        )}
      </div>

    </div>
  );
}
