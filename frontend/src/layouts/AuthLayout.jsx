import React, { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Tractor, Wind, ShieldCheck, Leaf,
  Cpu, ShoppingBag, HeadphonesIcon, Zap,
  CheckCircle2,
} from 'lucide-react';
import '../features/auth/styles/auth-tokens.css';

/* ------------------------------------------------------------------ */
/* Dynamic portal config based on route                                 */
/* ------------------------------------------------------------------ */
const PORTAL_MAP = [
  { pattern: /farmer/,  label: 'Farmer Portal',          icon: Sprout,      accent: '#22C55E' },
  { pattern: /owner/,   label: 'Equipment Owner Portal',  icon: Tractor,     accent: '#F97316' },
  { pattern: /sprayer|operator/, label: 'Operator Portal',icon: Wind,        accent: '#3B82F6' },
  { pattern: /admin/,   label: 'Admin Portal',            icon: ShieldCheck, accent: '#A855F7' },
];

const DEFAULT_PORTAL = { label: 'KisanO Platform', icon: Sprout, accent: '#22C55E' };

function usePortal() {
  const { pathname } = useLocation();
  return useMemo(() => {
    const match = PORTAL_MAP.find(p => p.pattern.test(pathname));
    return match ?? DEFAULT_PORTAL;
  }, [pathname]);
}

/* ------------------------------------------------------------------ */
/* Feature cards shown in the left branding panel                       */
/* ------------------------------------------------------------------ */
const FEATURES = [
  { icon: Cpu,           label: 'Smart Farming',     desc: 'AI-powered crop insights' },
  { icon: Tractor,       label: 'Equipment Rental',  desc: 'Verified machinery network' },
  { icon: ShoppingBag,   label: 'Marketplace',       desc: 'Buy & sell agri products' },
  { icon: HeadphonesIcon,label: '24×7 Support',      desc: 'Always available helpdesk' },
];

/* ------------------------------------------------------------------ */
/* Left branding panel                                                  */
/* ------------------------------------------------------------------ */
function BrandPanel({ portal }) {
  const PortalIcon = portal.icon;

  return (
    <div
      className="hidden lg:flex relative flex-col justify-between h-full overflow-hidden"
      style={{ background: 'linear-gradient(160deg, var(--auth-panel-grad-start) 0%, var(--auth-panel-grad-end) 100%)' }}
      aria-hidden="true"
    >
      {/* Decorative background orbs */}
      <div className="auth-orb absolute top-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)' }} />
      <div className="auth-orb absolute bottom-[-60px] right-[-60px] w-[260px] h-[260px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)' }} />

      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#22C55E 1px, transparent 1px), linear-gradient(90deg, #22C55E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Top: Logo + badge */}
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <Sprout size={22} className="text-green-400" />
          </div>
          <div>
            <span className="text-[22px] font-black tracking-tight text-white">
              Kisan<span className="text-green-400">O</span>
            </span>
            <div className="text-[11px] text-green-400/70 font-medium tracking-widest uppercase -mt-0.5">
              Smart Agriculture Platform
            </div>
          </div>
        </div>

        {/* Portal badge */}
        <motion.div
          key={portal.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-8"
          style={{ background: `${portal.accent}18`, border: `1px solid ${portal.accent}35`, color: portal.accent }}
        >
          <PortalIcon size={13} />
          {portal.label}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <h2 className="text-[34px] font-black leading-tight text-white mb-4">
            Empowering Farmers,<br />
            <span className="text-green-400">Building the Future</span>
          </h2>
          <p className="text-[14px] text-slate-400 leading-relaxed max-w-[280px]">
            Access your dashboard, manage equipment, bookings and marketplace from one place.
          </p>
        </motion.div>
      </div>

      {/* Middle: Illustration zone (pure CSS + Lucide) */}
      <div className="relative z-10 px-8 py-4">
        {/* Abstract field illustration */}
        <div className="relative h-[130px] flex items-end">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-16 rounded-2xl"
            style={{ background: 'linear-gradient(180deg, rgba(22,163,74,0.08), rgba(22,163,74,0.18))' }} />
          {/* Tractor icon */}
          <motion.div
            className="auth-float absolute bottom-6 left-8"
            aria-hidden="true"
          >
            <Tractor size={48} className="text-green-400/60" />
          </motion.div>
          {/* Leaf accents */}
          <motion.div className="auth-float-delay absolute bottom-10 right-10" aria-hidden="true">
            <Leaf size={28} className="text-green-500/40 rotate-12" />
          </motion.div>
          <motion.div className="auth-float absolute bottom-14 right-24" aria-hidden="true">
            <Leaf size={18} className="text-green-400/30 -rotate-20" />
          </motion.div>
          {/* Windmill / tower SVG simplified */}
          <div className="absolute bottom-6 left-[46%]" aria-hidden="true">
            <div className="flex flex-col items-center">
              <div className="w-px h-12 bg-green-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/25" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Feature cards */}
      <div className="relative z-10 p-8 pt-2">
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                className="flex flex-col gap-1 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <Icon size={13} className="text-green-400" />
                  </div>
                  <span className="text-[12px] font-semibold text-white">{f.label}</span>
                </div>
                <p className="text-[11px] text-slate-500">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Version tag */}
        <p className="text-[11px] text-slate-600 mt-4 flex items-center gap-1.5">
          <CheckCircle2 size={11} className="text-green-500/50" />
          Version 1.0 · Enterprise Edition
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main AuthLayout                                                      */
/* ------------------------------------------------------------------ */
const pageVariants = {
  initial:  { opacity: 0, y: 14 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
};

export default function AuthLayout() {
  const portal = usePortal();
  const { pathname } = useLocation();

  return (
    <div
      className="min-h-screen flex text-white font-sans"
      style={{ backgroundColor: 'var(--auth-bg)' }}
    >
      {/* ── Left branding panel (desktop only) ─────────────────── */}
      <div className="hidden lg:block lg:w-[42%] xl:w-[38%] shrink-0 sticky top-0 h-screen">
        <BrandPanel portal={portal} />
      </div>

      {/* ── Right: scrollable content area ─────────────────────── */}
      <div className="flex flex-col flex-1 min-h-screen overflow-y-auto">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4"
          style={{ background: 'rgba(8,19,13,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 lg:opacity-0 lg:pointer-events-none" aria-label="KisanO Home">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Sprout size={16} className="text-green-400" />
            </div>
            <span className="text-[18px] font-black tracking-tight">
              Kisan<span className="text-green-400">O</span>
            </span>
          </Link>

          {/* "New to KisanO?" / "Back to login" */}
          <div className="flex items-center gap-2 text-[13px] text-slate-400">
            <span className="hidden sm:inline">New to KisanO?</span>
            <Link
              to="/auth/select-role"
              className="text-green-400 font-semibold hover:text-green-300 transition-colors auth-focus-ring rounded px-1"
            >
              Register Here
            </Link>
          </div>
        </header>

        {/* Main form area */}
        <main
          id="main"
          className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8"
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full max-w-[520px]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer
          className="py-5 text-center text-[12px] text-slate-600"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          © 2026 KisanO · Empowering Indian Agriculture · All rights reserved.
        </footer>
      </div>
    </div>
  );
}