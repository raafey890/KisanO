import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Printer, Download, Share2, Leaf, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AiDoctorReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* Non-printable header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4 print:hidden">
        <button 
          onClick={() => navigate(`/farmer/ai-doctor/result/${id || 'NEW-SCAN'}`)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Results
        </button>

        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="bg-white border border-gray-200 rounded-[2rem] p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0 space-y-10">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-green-600 font-black text-xl">
              <Leaf className="w-6 h-6" /> KisanO AI Plant Doctor
            </div>
            <h1 className="text-3xl font-black text-gray-900 mt-4">Diagnostic Report</h1>
            <p className="text-gray-500 font-bold text-sm mt-1">Generated on: 28 August 2026</p>
            <p className="text-gray-500 font-bold text-sm">Scan ID: {id || '#SCN-101'}</p>
          </div>
          
          {/* Mock QR Code space */}
          <div className="w-24 h-24 border-2 border-gray-900 rounded-xl p-1">
             <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-50 filter grayscale"></div>
          </div>
        </div>

        {/* Core Diagnosis */}
        <div className="grid grid-cols-2 gap-8">
          <div>
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Patient (Crop)</h3>
             <p className="text-xl font-black text-gray-900">Cotton Plant</p>
          </div>
          <div>
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Detected Issue</h3>
             <p className="text-xl font-black text-red-600">Bacterial Blight</p>
          </div>
          <div>
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">AI Confidence</h3>
             <p className="text-xl font-black text-blue-600 flex items-center gap-1">
               <ShieldCheck className="w-5 h-5" /> 94%
             </p>
          </div>
          <div>
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Severity Level</h3>
             <p className="text-xl font-black text-red-600">High (Immediate Action Required)</p>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <div>
             <h3 className="text-lg font-black text-gray-900 mb-2">AI Summary</h3>
             <p className="text-gray-600 font-medium leading-relaxed">
               The AI has detected signs of Bacterial Blight on the cotton leaves. Immediate action is required to prevent it from spreading to healthy parts of the crop. Bacterial blight is a highly contagious disease caused by Xanthomonas axonopodis. It primarily affects leaves, stems, and bolls of cotton plants.
             </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-4">
             <div>
               <h3 className="text-sm font-black text-gray-900 mb-3 border-b border-gray-100 pb-2">Primary Symptoms</h3>
               <ul className="space-y-2">
                 <li className="flex gap-2 text-sm text-gray-700 font-medium"><span className="text-gray-400">•</span> Water-soaked angular spots on leaves</li>
                 <li className="flex gap-2 text-sm text-gray-700 font-medium"><span className="text-gray-400">•</span> Blackening of stem (blackarm)</li>
                 <li className="flex gap-2 text-sm text-gray-700 font-medium"><span className="text-gray-400">•</span> Premature boll drop</li>
               </ul>
             </div>
             <div>
               <h3 className="text-sm font-black text-gray-900 mb-3 border-b border-gray-100 pb-2">Possible Causes</h3>
               <ul className="space-y-2">
                 <li className="flex gap-2 text-sm text-gray-700 font-medium"><span className="text-gray-400">•</span> Infected seeds</li>
                 <li className="flex gap-2 text-sm text-gray-700 font-medium"><span className="text-gray-400">•</span> Rain splashes spreading bacteria</li>
                 <li className="flex gap-2 text-sm text-gray-700 font-medium"><span className="text-gray-400">•</span> High humidity and warm temperatures</li>
               </ul>
             </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="space-y-6 pt-8 border-t border-gray-200">
           <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
             Official Prescription
           </h2>
           
           <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 print:bg-transparent print:border-gray-300">
             <h4 className="font-black text-gray-900 mb-4">Chemical Treatment Protocol</h4>
             <ul className="space-y-3">
               <li className="flex items-start gap-2 text-sm font-bold text-gray-700">
                 <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" /> Spray Copper Oxychloride (50% WP) @ 2.5g/L of water.
               </li>
               <li className="flex items-start gap-2 text-sm font-bold text-gray-700">
                 <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" /> Mix with Streptocycline (1g/10L water) for severe infections.
               </li>
               <li className="flex items-start gap-2 text-sm font-bold text-gray-700">
                 <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" /> Apply 2-3 sprays at 15-day intervals.
               </li>
             </ul>
             
             <div className="mt-6 flex items-start gap-2 text-amber-700 bg-amber-50 p-4 rounded-xl print:border print:border-amber-200">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">Always wear protective gear (mask, gloves) when mixing and spraying chemicals. Avoid spraying during strong winds or rain.</p>
             </div>
           </div>
        </div>

        {/* Footer */}
        <div className="pt-12 text-center text-xs font-bold text-gray-400 border-t border-gray-100">
          <p>This report was generated by KisanO AI Plant Doctor. While our AI is highly accurate, it is recommended to consult a local agronomist for severe crop threats.</p>
          <p className="mt-2">www.kisano.in | support@kisano.in | +91 800 123 4567</p>
        </div>

      </div>
    </div>
  );
}
