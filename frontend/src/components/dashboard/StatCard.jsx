import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StatCard({ title, value, status, icon: Icon, color, link, linkText }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-xl flex flex-col justify-between group"
    >
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${color} opacity-20 pointer-events-none`} />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</h3>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${color} bg-white/5 transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {status}
        </span>

        {link && (
          <Link
            to={link}
            className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
          >
            <span>{linkText || 'View'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
