import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function QuickActionButton({ label, desc, icon: Icon, to, color, shadow }) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`p-5 rounded-2xl bg-gray-900/90 border border-white/10 text-left flex items-start gap-4 transition-all duration-300 ${shadow} hover:border-white/20 group w-full`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-black text-white group-hover:text-green-400 transition-colors leading-tight">
          {label}
        </h4>
        <p className="text-[11px] text-gray-400 font-medium mt-1 leading-normal">
          {desc}
        </p>
      </div>
    </motion.button>
  );
}
