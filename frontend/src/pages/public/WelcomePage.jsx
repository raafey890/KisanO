import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FarmerPortal, EquipmentOwnerPortal, SprayerPortal, AdminPortal } from '../../assets/images';
import {
  Search,
  Tractor,
  ShoppingBag,
  Wind,
  Microscope,
  MapPin,
  ChevronRight,
  Sprout,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  Compass,
  Calendar,
  Store,
  Shield,
  Cloud,
  Users,
  Scan,
} from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: 'Equipment Rental',
    description: 'Rent tractors, harvesters, tillers and other agricultural machinery from trusted local owners.',
    image: '/assets/cat_equipment.jpg',
    badge: '200+ Machines',
    button: 'Explore Equipment',
    link: '/explore?tab=equipment',
    icon: Tractor,
  },
  {
    title: 'Agriculture Marketplace',
    description: 'Buy and sell seedlings, seeds, fertilizers, farm tools and other agricultural products in your local area.',
    image: '/assets/cat_seedlings.jpg',
    badge: '1000+ Listings',
    button: 'Explore Marketplace',
    link: '/explore?tab=marketplace',
    icon: ShoppingBag,
  },
  {
    title: 'Crop Sprayer Services',
    description: 'Book verified crop spraying professionals for pesticide and fertilizer application.',
    image: '/assets/cat_sprayers.jpg',
    badge: 'Verified Experts',
    button: 'Explore Sprayers',
    link: '/explore?tab=sprayers',
    icon: Wind,
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Compass,
    title: 'Choose a Service',
    desc: 'Browse Equipment Rental, Agriculture Marketplace, or Crop Sprayer Services.',
  },
  {
    step: '02',
    icon: MapPin,
    title: 'Find Nearby Listings',
    desc: 'Discover verified equipment owners, agricultural products, and professionals available near your district.',
  },
  {
    step: '03',
    icon: Calendar,
    title: 'Book or Contact',
    desc: 'Select your preferred option, choose an available time, or contact the seller directly.',
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'Complete Your Farming Task',
    desc: 'Get your machinery, products, or spraying service quickly and efficiently.',
  },
];

const FEATURES = [
  {
    title: 'Equipment Rental',
    desc: 'Book tractors, harvesters, tillers and agricultural machinery with live availability.',
    icon: Tractor,
    comingSoon: false,
  },
  {
    title: 'Agriculture Marketplace',
    desc: 'Buy and sell seedlings, seeds, fertilizers, farm tools and agricultural products locally.',
    icon: Store,
    comingSoon: false,
  },
  {
    title: 'Verified Sprayer Services',
    desc: 'Hire experienced crop spraying professionals verified by KisanO.',
    icon: Shield,
    comingSoon: false,
  },
  {
    title: 'AI Plant Doctor',
    desc: 'Scan crop leaves and receive instant disease detection and treatment suggestions.',
    icon: Scan,
    comingSoon: true,
  },
  {
    title: 'Weather Intelligence',
    desc: 'Receive weather alerts and farming recommendations based on your location.',
    icon: Cloud,
    comingSoon: true,
  },
  {
    title: 'District Community',
    desc: 'Connect with local farmers, machinery owners and agricultural businesses.',
    icon: Users,
    comingSoon: false,
  },
];

const PORTALS = [
  {
    title: 'Farmer Portal',
    desc: 'Rent machinery, explore the agriculture marketplace, book sprayer services, and use AI-powered farming tools.',
    image: FarmerPortal,
    link: '/farmer/login',
    cta: 'Enter Farmer Portal',
    color: 'from-green-600/70 to-green-950/70',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]',
    badgeClass: 'bg-green-500/20 text-green-300 border-green-500/30',
    btnClass: 'bg-green-500 hover:bg-green-400 text-white',
  },
  {
    title: 'Equipment Owner Portal',
    desc: 'List your equipment, manage bookings, track earnings, and grow your rental business.',
    image: EquipmentOwnerPortal,
    link: '/owner/login',
    cta: 'Enter Equipment Owner Portal',
    color: 'from-orange-600/70 to-orange-950/70',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(249,115,22,0.3)]',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    btnClass: 'bg-orange-500 hover:bg-orange-400 text-white',
  },
  {
    title: 'Sprayer Portal',
    desc: 'Accept service requests, manage schedules, and connect with nearby farmers.',
    image: SprayerPortal,
    link: '/sprayer/login',
    cta: 'Enter Sprayer Portal',
    color: 'from-blue-600/70 to-blue-950/70',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    btnClass: 'bg-blue-500 hover:bg-blue-400 text-white',
  },
  {
    title: 'Admin Portal',
    desc: 'Manage users, equipment, marketplace, approvals, reports, and platform analytics.',
    image: AdminPortal,
    link: '/admin/login',
    cta: 'Enter Admin Portal',
    color: 'from-purple-600/70 to-purple-950/70',
    hoverGlow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    btnClass: 'bg-purple-500 hover:bg-purple-400 text-white',
  },
];

// ─── Shared layout constants ──────────────────────────────────────────────────
const CONTAINER = 'w-full max-w-6xl mx-auto px-6 lg:px-12';
const SECTION_PY = 'py-28 md:py-36';

// ─── Section Header Sub-component ─────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16 max-w-2xl mx-auto">
      {eyebrow && (
        <span className="inline-block text-xs font-black uppercase tracking-widest text-green-400 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-gray-400 leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WelcomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [district, setDistrict] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (district) query.append('district', district);
    navigate(`/explore?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/hero_farm.jpg')` }}
        >
          {/* Gradient fades seamlessly into the next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/40 to-gray-950" />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6 drop-shadow-xl">
            The modern way to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              farm smarter.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-medium leading-relaxed mb-10">
            Rent heavy machinery, hire certified crop sprayers, and trade
            high-quality seedlings — all within your local district.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-3xl flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-2xl p-2.5 rounded-2xl border border-white/20 shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-3 bg-white/80 rounded-xl px-5 h-14">
              <Search className="w-5 h-5 text-gray-600 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tractor, Seedlings, Sprayers…"
                className="w-full bg-transparent text-gray-900 font-semibold placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 bg-white/80 rounded-xl px-5 h-14">
              <MapPin className="w-5 h-5 text-gray-600 shrink-0" />
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Your District"
                className="w-full bg-transparent text-gray-900 font-semibold placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 bg-green-500 hover:bg-green-400 text-white font-black px-8 h-14 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(34,197,94,0.35)] flex items-center gap-2 text-sm"
            >
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              200+ Machines
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              50+ Sprayers
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              500+ Farmers
            </span>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — SERVICES
      ══════════════════════════════════════════════════ */}
      <section className="py-[100px] bg-gray-950">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16"
          >
            <span className="inline-block text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-6">
              OUR SERVICES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6 max-w-3xl">
              Everything you need for a successful harvest.
            </h2>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed font-medium max-w-3xl mx-auto">
              Instantly book machinery, trade agricultural products, and hire verified crop service providers directly in your district.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                onClick={() => navigate(s.link)}
                className="group flex flex-col h-full bg-gray-900 border border-white/10 rounded-[24px] overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                  
                  {/* Glass effect badge */}
                  <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {s.badge}
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative flex flex-col flex-1 p-8 pt-10">
                  {/* Floating Circular Icon */}
                  <div className="absolute -top-10 left-8 w-16 h-16 bg-gray-900 border border-white/10 rounded-full flex items-center justify-center shadow-xl group-hover:border-green-400/50 group-hover:bg-gray-800 transition-all duration-500">
                    <s.icon className="w-7 h-7 text-green-400" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-base text-gray-400 leading-relaxed mb-8 flex-1">
                    {s.description}
                  </p>
                  
                  {/* Primary Button */}
                  <div className="mt-auto flex items-center justify-between w-full pt-6 border-t border-white/10">
                    <span className="text-sm font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                      {s.button}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="py-[100px] bg-[#0a0f0a]">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-20"
          >
            <span className="inline-block text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-6">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6 max-w-3xl">
              How KisanO Makes Farming Simple
            </h2>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed font-medium max-w-3xl mx-auto">
              Book equipment, explore agricultural products, and hire verified crop service providers in just a few simple steps.
            </p>
          </motion.div>

          <div className="relative mt-12">
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-white/10 z-0 overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                whileInView={{ x: '100%' }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
              />
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
            >
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group relative flex flex-col items-center text-center p-8 lg:p-10 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[24px] hover:border-white/20 hover:bg-gray-900/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500"
                >
                  {/* Step number watermark */}
                  <span className="absolute top-6 left-6 text-6xl lg:text-7xl font-black text-white/5 select-none transition-colors duration-500 group-hover:text-white/10">
                    {step.step}
                  </span>
                  
                  <div className="relative w-20 h-20 mb-8 rounded-full flex items-center justify-center bg-gray-950 border border-white/20 group-hover:border-green-500/50 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 shrink-0">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    >
                      <step.icon className="w-8 h-8 text-green-400" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — PLATFORM FEATURES
      ══════════════════════════════════════════════════ */}
      <section className="py-[100px] bg-gray-950">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-20"
          >
            <span className="inline-block text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-6">
              WHY CHOOSE KISANO
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6 max-w-3xl">
              Everything You Need In One Agriculture Platform
            </h2>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed font-medium max-w-3xl mx-auto">
              KisanO brings machinery rentals, agricultural marketplace, verified crop services, AI tools, and local farming communities into one digital ecosystem.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative flex flex-col p-8 bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-[24px] hover:border-white/20 hover:bg-gray-900/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden cursor-pointer"
              >
                {/* Subtle gradient background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-transparent group-hover:from-green-500/5 transition-colors duration-500" />
                
                {/* Header row: Icon & Coming Soon Badge */}
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gray-950 border border-white/10 flex items-center justify-center group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-500">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    >
                      <f.icon className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-500" />
                    </motion.div>
                  </div>
                  
                  {f.comingSoon && (
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6 flex-1">
                    {f.desc}
                  </p>
                  
                  <div className="flex items-center text-sm font-bold text-gray-500 group-hover:text-green-400 transition-colors duration-300 mt-auto">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — ROLE PORTALS
      ══════════════════════════════════════════════════ */}
      <section className="py-[100px] bg-[#0a0f0a]">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16"
          >
            <span className="inline-block text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-6">
              ROLE PORTALS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6 max-w-3xl">
              Choose Your Portal
            </h2>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed font-medium max-w-3xl mx-auto">
              Whether you're a Farmer, Equipment Owner, Sprayer, or Administrator, KisanO provides a dedicated experience designed for your role.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {PORTALS.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group relative flex flex-col rounded-[20px] overflow-hidden bg-gray-900 border border-white/10 hover:-translate-y-2 transition-all duration-500 ${p.hoverGlow}`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-gray-900">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dark gradient overlay for text readability */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-70 group-hover:opacity-60 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gray-950/50" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col flex-1 p-8 h-full min-h-[340px]">
                  <div className="mb-auto">
                    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md mb-6 ${p.badgeClass}`}>
                      {p.title.split(' ')[0]}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-4 leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed font-medium">
                      {p.desc}
                    </p>
                  </div>
                  
                  <Link
                    to={p.link}
                    className={`mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 font-bold text-sm rounded-xl transition-all hover:scale-[1.02] ${p.btnClass} shadow-lg`}
                  >
                    {p.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 6 — CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="py-[100px] bg-gray-950">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative bg-gray-900 border border-white/10 rounded-[28px] pt-14 px-8 md:px-16 pb-[60px] text-center overflow-hidden flex flex-col items-center justify-center"
          >
            {/* Subtle glow blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[680px] mx-auto flex flex-col items-center text-center">
              {/* Badge */}
              <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-[20px] inline-block">
                Get Started Today
              </span>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-[32px] tracking-tight leading-[1.2] text-center">
                Ready to transform <br className="hidden sm:block" /> your farm?
              </h2>

              {/* Paragraph */}
              <p className="text-base md:text-lg text-gray-400 mb-[40px] leading-[1.7] font-medium text-center max-w-[680px]">
                Join KisanO. Connect with local machinery owners, seedling buyers,
                and spray workers in your district — in minutes.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-[480px]">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-1/2"
                >
                  <Link
                    to="/farmer/register"
                    className="w-full h-14 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.35)]"
                  >
                    Register as Farmer <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-1/2"
                >
                  <Link
                    to="/owner/register"
                    className="w-full h-14 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all"
                  >
                    Register as Owner
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER & BOTTOM BAR
      ══════════════════════════════════════════════════ */}
      <footer className="bg-[#050805] text-gray-400 border-t border-white/10 pt-20 pb-10">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Four-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16">
            
            {/* Column 1: Logo & Short Description */}
            <div className="flex flex-col space-y-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500/30 transition-all">
                  <Sprout className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Kisan<span className="text-green-400">O</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-400 font-medium pt-2">
                Empowering Indian farmers through on-demand machinery rentals, direct agricultural marketplace, verified crop sprayers, and smart AI tools.
              </p>
            </div>

            {/* Column 2: Platform Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Platform
              </h4>
              <ul className="space-y-3.5 text-sm font-medium">
                <li>
                  <a href="#services" className="hover:text-green-400 transition-colors">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-green-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-green-400 transition-colors">
                    Platform Features
                  </a>
                </li>
                <li>
                  <Link to="/marketplace" className="hover:text-green-400 transition-colors">
                    Agri Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/rentals" className="hover:text-green-400 transition-colors">
                    Equipment Rental
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Portal Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Role Portals
              </h4>
              <ul className="space-y-3.5 text-sm font-medium">
                <li>
                  <Link to="/farmer/login" className="hover:text-green-400 transition-colors">
                    Farmer Portal
                  </Link>
                </li>
                <li>
                  <Link to="/owner/login" className="hover:text-green-400 transition-colors">
                    Equipment Owner Portal
                  </Link>
                </li>
                <li>
                  <Link to="/sprayer/login" className="hover:text-green-400 transition-colors">
                    Sprayer Portal
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-green-400 transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Support Information */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                Support
              </h4>
              <ul className="space-y-3.5 text-sm font-medium">
                <li>
                  <Link to="/contact" className="hover:text-green-400 transition-colors">
                    Help Center & Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-green-400 transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link to="/district-support" className="hover:text-green-400 transition-colors">
                    District Support Units
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-green-400 transition-colors">
                    Farming Community
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Subtle Divider */}
          <div className="border-t border-white/10 pt-8">
            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
              <div>
                © 2026 KisanO. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
                <Link to="/about" className="hover:text-gray-300 transition-colors">
                  About Us
                </Link>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
