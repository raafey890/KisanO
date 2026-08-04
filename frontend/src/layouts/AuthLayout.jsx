import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#050805] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="relative z-10 h-20 px-6 lg:px-12 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-gray-950/40">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500/30 transition-all">
            <Sprout className="w-6 h-6 text-green-400" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Kisan<span className="text-green-400">O</span>
          </span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-xl lg:max-w-2xl"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-6 text-center text-xs font-medium text-gray-500 border-t border-white/5 bg-gray-950/60">
        © 2026 KisanO. Empowering Indian Agriculture. All rights reserved.
      </footer>
    </div>
  );
}