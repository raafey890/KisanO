import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function RoleCard({ role, selected, onSelect }) {
  const { id, title, desc, icon: Icon, badge, color, border, shadow } = role;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
        selected
          ? `bg-gray-900/90 ${border} ${shadow} ring-2 ring-green-500/50`
          : 'bg-gray-900/40 border-white/10 hover:border-white/20 hover:bg-gray-900/60'
      }`}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            selected ? color : 'bg-gray-800 text-gray-400'
          } transition-colors`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-white">{title}</h3>
            {badge && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
