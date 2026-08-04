import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, Camera, X, Image as ImageIcon, CheckCircle2, 
  AlertCircle, Leaf, Loader2, ArrowRight, Sun, Maximize, Zap
} from 'lucide-react';

export default function AiDoctorUpload() {
  const navigate = useNavigate();
  // States: 'upload' -> 'preview' -> 'analyzing' -> 'error' (optional mock)
  const [step, setStep] = useState('upload');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Uploading Image...');

  // Mock handling file drop/select
  const handleSimulateUpload = () => {
    setStep('preview');
  };

  const handleStartAnalysis = () => {
    setStep('analyzing');
  };

  // Simulate AI Analysis Steps
  useEffect(() => {
    if (step === 'analyzing') {
      const steps = [
        { progress: 20, text: 'Detecting Crop Type...' },
        { progress: 45, text: 'Scanning for Pathogens...' },
        { progress: 70, text: 'Comparing with AI Database...' },
        { progress: 90, text: 'Generating Treatment Plan...' },
        { progress: 100, text: 'Analysis Complete!' },
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setAnalysisProgress(steps[currentStep].progress);
          setAnalysisText(steps[currentStep].text);
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Navigate to mock result page
            navigate('/farmer/ai-doctor/result/NEW-SCAN');
          }, 500);
        }
      }, 1200); // 1.2s per step for a premium feel

      return () => clearInterval(interval);
    }
  }, [step, navigate]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex flex-col justify-center">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          {step === 'upload' && 'Upload Plant Image'}
          {step === 'preview' && 'Review Image'}
          {step === 'analyzing' && 'AI is Analysing'}
        </h1>
        <p className="text-base font-medium text-gray-500 mt-2">
          {step === 'upload' && 'For best results, follow the upload guidelines below.'}
          {step === 'preview' && 'Make sure the disease is clearly visible.'}
          {step === 'analyzing' && 'Please wait while our expert AI examines your plant.'}
        </p>
      </div>

      <div className="relative bg-white border border-gray-200 rounded-[2rem] shadow-xl overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 sm:p-12 flex flex-col gap-8"
            >
              {/* Dropzone */}
              <div 
                onClick={handleSimulateUpload}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-gray-700">Click or drag image here</p>
                  <p className="text-sm font-bold text-gray-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              {/* Or divider */}
              <div className="flex items-center gap-4 w-full max-w-md mx-auto">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* Camera CTA */}
              <button 
                onClick={handleSimulateUpload}
                className="w-full max-w-md mx-auto h-14 bg-gray-900 hover:bg-gray-800 text-white font-black text-base rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" /> Open Camera
              </button>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-4">
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Upload Guidelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                    <Sun className="w-4 h-4 text-amber-500" /> Good lighting
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                    <Leaf className="w-4 h-4 text-green-500" /> Single leaf focus
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                    <Maximize className="w-4 h-4 text-purple-500" /> Close-up shot
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-8"
            >
              {/* Mock Uploaded Image Container */}
              <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-3xl border border-green-300 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group">
                <Leaf className="w-32 h-32 text-green-600/30" />
                <span className="absolute bottom-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-800">
                  IMG_2026_CROP.jpg
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button 
                  onClick={() => setStep('upload')}
                  className="flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Retake
                </button>
                <button 
                  onClick={handleStartAnalysis}
                  className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Analyse <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ANALYZING */}
          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 sm:p-16 flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <div className="relative w-32 h-32 mb-8">
                {/* Pulsing rings */}
                <motion.div 
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-green-400 rounded-full"
                ></motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1.5], opacity: [0.8, 0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="absolute inset-0 bg-green-500 rounded-full"
                ></motion.div>
                
                {/* Core Icon */}
                <div className="absolute inset-0 bg-white rounded-full shadow-lg flex items-center justify-center z-10 border-4 border-green-50">
                  <Zap className="w-12 h-12 text-green-500 fill-current" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2">{analysisText}</h2>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs h-3 bg-gray-100 rounded-full overflow-hidden mt-6">
                <motion.div 
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ ease: "easeInOut" }}
                ></motion.div>
              </div>
              <p className="text-sm font-bold text-gray-400 mt-3">{analysisProgress}% Complete</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
