import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, Tractor, ShieldCheck, Home, Compass, Wind } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',        label: 'Home',      icon: Home },
  { to: '/explore', label: 'Explore',   icon: Compass },
  { to: '/explore?tab=equipment',   label: 'Equipment', icon: Tractor },
  { to: '/explore?tab=marketplace', label: 'Seedlings', icon: Sprout },
  { to: '/explore?tab=sprayers',    label: 'Sprayers',  icon: Wind },
];

const PORTALS = [
  { to: '/farmer/login', label: 'Farmer',          color: '#4ade80', icon: Sprout },
  { to: '/owner/login',  label: 'Equipment Owner', color: '#fbbf24', icon: Tractor },
  { to: '/admin/login',  label: 'Admin',           color: '#60a5fa', icon: ShieldCheck },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <Sprout className="w-8 h-8 text-green-500" />
          <span className="text-2xl font-black tracking-tight text-white">
            Kisan<span className="text-green-500">O</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-2 text-sm font-semibold transition-all no-underline ${
                currentPath === link.to || (link.to === '/' && currentPath === '/') || (link.to === '/explore' && currentPath === '/explore') 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/farmer/login"
            className="text-gray-300 font-semibold hover:text-white transition-colors no-underline text-sm"
          >
            Sign In
          </Link>
          <Link to="/farmer/register"
            className="text-white font-bold hover:text-gray-300 transition-colors no-underline text-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-white"
          whileTap={{ scale: 0.92 }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 px-5 pb-5 pt-3 flex flex-col gap-2 bg-gray-950"
          >
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold no-underline text-gray-300 bg-white/5">
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {PORTALS.map(p => (
              <Link key={p.to} to={p.to} onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold no-underline flex items-center gap-3 text-white bg-white/5">
                <p.icon className="w-5 h-5" style={{ color: p.color }} /> {p.label} Portal
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
