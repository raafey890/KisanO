import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, AlertTriangle, ShieldCheck, Download, Share2, 
  Leaf, Info, Droplet, Sun, Scan, ArrowRight, Star, AlertCircle, Bookmark
} from 'lucide-react';

import npkFertilizerImg from '../../assets/products/npk_fertilizer.jpg';

export default function AiDoctorResult() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock Result Data
  const RESULT = {
    id: id || 'NEW-SCAN',
    date: 'Just Now',
    cropName: 'Cotton',
    diseaseName: 'Bacterial Blight',
    status: 'Diseased',
    confidence: '94%',
    severity: 'High',
    summary: 'The AI has detected signs of Bacterial Blight on the cotton leaves. Immediate action is required to prevent it from spreading to healthy parts of the crop.',
    diseaseInfo: {
      description: 'Bacterial blight is a highly contagious disease caused by Xanthomonas axonopodis. It primarily affects leaves, stems, and bolls of cotton plants.',
      symptoms: ['Water-soaked angular spots on leaves', 'Blackening of stem (blackarm)', 'Premature boll drop'],
      causes: ['Infected seeds', 'Rain splashes spreading bacteria', 'High humidity and warm temperatures'],
      spread: 'Spreads rapidly during monsoon through wind-driven rain and infected farming tools.',
      affectedCrops: ['Cotton', 'Beans', 'Rice']
    },
    treatments: {
      organic: [
        'Prune and destroy infected leaves immediately.',
        'Apply copper-based organic sprays.',
        'Ensure proper spacing between plants to improve air circulation.'
      ],
      chemical: [
        'Spray Copper Oxychloride (50% WP) @ 2.5g/L of water.',
        'Mix with Streptocycline (1g/10L water) for severe infections.',
        'Apply 2-3 sprays at 15-day intervals.'
      ],
      safety: 'Always wear protective gear (mask, gloves) when mixing and spraying chemicals.'
    },
    prevention: [
      'Use certified disease-free seeds for next planting.',
      'Practice crop rotation with non-host crops like cereals.',
      'Avoid overhead irrigation to keep foliage dry.'
    ]
  };

  const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Copper Oxychloride 50% WP (500g)', image: npkFertilizerImg, price: 450, seller: 'AgriCare Solutions', rating: 4.8 },
    { id: 'p2', name: 'Streptocycline Antibiotic (10g)', image: npkFertilizerImg, price: 120, seller: 'Kisan Meds', rating: 4.5 }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4">
        <button 
          onClick={() => navigate('/farmer/ai-doctor')}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-5 h-5" /> Back to AI Home
        </button>

        <div className="flex items-center gap-3">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={() => navigate(`/farmer/ai-doctor/report/${id || 'NEW-SCAN'}`)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> PDF Report
          </button>
          <button 
            onClick={() => navigate('/farmer/ai-doctor/upload')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm hidden sm:flex"
          >
            <Scan className="w-4 h-4" /> Scan Another
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Image & Main Diagnosis */}
        <div className="space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-6"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden relative border border-gray-100 flex items-center justify-center">
               <Leaf className="w-32 h-32 text-gray-300" />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white">
                 <ShieldCheck className="w-4 h-4 text-blue-500" />
                 <span className="text-xs font-black text-gray-900">{RESULT.confidence} Match</span>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                      {RESULT.cropName}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                      {RESULT.severity} Severity
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                    {RESULT.diseaseName}
                  </h1>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-900 leading-relaxed">
                  {RESULT.summary}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Connect to Sprayer Service Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Droplet className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-4">
              <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Professional Help
              </div>
              <div>
                <h3 className="text-xl font-black mb-1">Need Expert Spraying?</h3>
                <p className="text-sm text-gray-300 font-medium max-w-[200px] leading-relaxed">
                  Book a verified local professional to handle chemical applications safely.
                </p>
              </div>
              <button 
                onClick={() => navigate('/farmer/sprayers')}
                className="mt-2 bg-green-500 hover:bg-green-400 text-gray-900 font-black text-sm px-6 py-3 rounded-xl transition-colors shadow-lg"
              >
                Book Sprayer Service
              </button>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Info & Treatments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Disease Info Tab */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6"
          >
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500" /> Disease Information
            </h2>
            
            <p className="text-gray-600 font-medium leading-relaxed">
              {RESULT.diseaseInfo.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Key Symptoms</h4>
                <ul className="space-y-2">
                  {RESULT.diseaseInfo.symptoms.map((sym, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></div>
                      {sym}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Possible Causes</h4>
                <ul className="space-y-2">
                  {RESULT.diseaseInfo.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0"></div>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Treatment Options */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-8"
          >
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-500" /> Treatment Recommendations
            </h2>

            <div className="space-y-6">
              
              {/* Chemical */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-4">
                <h4 className="font-black text-blue-900 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" /> Chemical Treatment
                </h4>
                <ul className="space-y-2">
                  {RESULT.treatments.chemical.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
                <div className="bg-white/60 p-3 rounded-xl border border-blue-50 flex items-start gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-gray-600">{RESULT.treatments.safety}</p>
                </div>
              </div>

              {/* Organic */}
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 space-y-4">
                <h4 className="font-black text-green-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" /> Organic Treatment
                </h4>
                <ul className="space-y-2">
                  {RESULT.treatments.organic.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </motion.div>

          {/* Marketplace Recommendations */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 pt-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Recommended Products
              </h2>
              <button 
                onClick={() => navigate('/farmer/marketplace')}
                className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                View Marketplace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_PRODUCTS.map(product => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-black text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{product.name}</h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-current" /> {product.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-gray-900">₹{product.price}</span>
                      <button className="text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
