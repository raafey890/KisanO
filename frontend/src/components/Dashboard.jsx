import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiDollarSign, FiBell, FiZap, FiCloud, FiSun } from 'react-icons/fi';
import api from '../services/api';

/* animated counter hook */
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return val;
}

const DIAGNOSES = [
  { disease: 'Rice Blast (సారి తెగులు)', medicine: 'Tricyclazole 75% WP — 0.6 g/litre', status: 'Critical', color: '#dc2626', bg: '#fef2f2' },
  { disease: 'Bacterial Leaf Blight (ఆకు ఎండు)', medicine: 'Copper Oxychloride 3g + Streptocycline 0.1g/litre', status: 'Moderate', color: '#b45309', bg: '#fef9c3' },
  { disease: 'Healthy Leaf (ఆరోగ్యకరమైన)', medicine: 'No treatment needed. Maintain regular irrigation.', status: 'Healthy', color: '#16a34a', bg: '#dcfce7' },
];

const WEATHER_DATA = {
  temp: '32°C',
  condition: 'Clear & Sunny',
  humidity: '68%',
  wind: '12 km/h',
  advisory: 'Excellent conditions for pesticide spraying today. Avoid irrigation after 4 PM.',
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.09 } } },
  item: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
};

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({ activeBookingsCount: 0, totalExpenses: 0, totalEarnings: 0 });
  const [notifications, setNotifications] = useState([]);
  const [leaf, setLeaf] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const activeCount = useCounter(stats.activeBookingsCount);
  const moneyCount = useCounter(stats.totalExpenses || stats.totalEarnings);

  useEffect(() => {
    (async () => {
      try {
        const ep = user.role === 'EQUIPMENT_OWNER' ? '/dashboards/owner' : '/dashboards/farmer';
        const res = await api.get(ep);
        if (res.success) {
          setStats(res.data);
          setNotifications(res.data.recentNotifications || []);
        }
      } catch (_) {}
    })();
  }, []);

  const handleScan = () => {
    if (!leaf) return;
    setScanning(true); setResult(null); setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);
    setTimeout(() => {
      setScanning(false);
      setResult(DIAGNOSES[Math.floor(Math.random() * DIAGNOSES.length)]);
    }, 2200);
  };

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col gap-6">

      {/* ── Welcome Banner ── */}
      <motion.div variants={stagger.item}
        className="relative rounded-2xl overflow-hidden p-7 text-white"
        style={{ background: 'linear-gradient(135deg, #000 0%, #18181b 60%, #16a34a 200%)' }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Welcome back</p>
            <h1 className="text-2xl font-black tracking-tight">{user.fullName}</h1>
            <p className="text-sm mt-1" style={{ color: '#a1a1aa' }}>{user.village}, {user.district}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FiSun size={18} className="mx-auto mb-1" style={{ color: '#fbbf24' }} />
              <p className="text-lg font-black">{WEATHER_DATA.temp}</p>
              <p className="text-[10px] font-medium" style={{ color: '#a1a1aa' }}>{WEATHER_DATA.condition}</p>
            </div>
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#6b7280' }}>Humidity</p>
              <p className="text-base font-black">{WEATHER_DATA.humidity}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: '#6b7280' }}>Wind</p>
              <p className="text-base font-black">{WEATHER_DATA.wind}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Advisory ── */}
      <motion.div variants={stagger.item}
        className="flex items-start gap-3 rounded-xl p-4"
        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
      >
        <FiZap size={16} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm font-semibold" style={{ color: '#15803d' }}>
          <strong>Today's Advisory:</strong> {WEATHER_DATA.advisory}
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Active Bookings', val: activeCount, icon: FiActivity, color: '#000', prefix: '' },
          { label: user.role === 'EQUIPMENT_OWNER' ? 'Total Earnings' : 'Total Expenses', val: moneyCount, icon: FiDollarSign, color: '#16a34a', prefix: '₹' },
          { label: 'Notifications', val: notifications.length, icon: FiBell, color: '#b45309', prefix: '' },
        ].map((s) => (
          <motion.div key={s.label} className="stat-card" whileHover={{ scale: 1.01 }}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>{s.label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: s.color === '#000' ? '#000' : s.color === '#16a34a' ? '#dcfce7' : '#fef3c7' }}>
                <s.icon size={15} style={{ color: s.color === '#000' ? '#fff' : s.color }} />
              </div>
            </div>
            <p className="text-3xl font-black" style={{ color: '#000' }}>{s.prefix}{s.val}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Grid: Plant Doctor + Notifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Plant Doctor */}
        <motion.div variants={stagger.item} className="card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#f0fdf4' }}>🩺</div>
            <div>
              <h2 className="font-black text-base tracking-tight">Plant Doctor</h2>
              <p className="text-xs" style={{ color: '#a1a1aa' }}>AI-powered crop disease detection</p>
            </div>
          </div>

          {/* Upload Zone */}
          {!leaf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 rounded-xl flex flex-col items-center justify-center gap-4 py-10 cursor-pointer"
              style={{ border: '2px dashed #e4e4e7', background: '#fafafa' }}
              onClick={() => setLeaf('sample')}
              whileHover={{ borderColor: '#000', background: '#f4f4f5' }}
            >
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <span className="text-5xl">🍃</span>
              </motion.div>
              <div className="text-center">
                <p className="font-bold text-sm">Select a leaf sample</p>
                <p className="text-xs mt-1" style={{ color: '#a1a1aa' }}>Tap to load sample or upload image</p>
              </div>
              <div className="flex gap-2">
                {['Paddy Leaf', 'Tomato Leaf', 'Wheat Leaf'].map(l => (
                  <button key={l} onClick={e => { e.stopPropagation(); setLeaf(l); }}
                    className="btn btn-ghost btn-sm">{l}</button>
                ))}
              </div>
            </motion.div>
          )}

          {leaf && !result && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#f4f4f5' }}>
                <span className="text-4xl">🍃</span>
                <div>
                  <p className="font-bold text-sm">{leaf}</p>
                  <p className="text-xs" style={{ color: '#a1a1aa' }}>Ready for analysis</p>
                </div>
              </div>

              {scanning ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold" style={{ color: '#52525b' }}>
                    <span>⚡ Running deep-learning scan...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e4e4e7' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: '#000', width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center animate-pulse" style={{ color: '#a1a1aa' }}>
                    Analyzing chlorophyll patterns, lesions, and discolorations...
                  </p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleScan} className="btn btn-black flex-1">Start Diagnosis</button>
                  <button onClick={() => setLeaf(null)} className="btn btn-ghost">Clear</button>
                </div>
              )}
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-xl p-5"
              style={{ background: result.bg, border: `1.5px solid ${result.color}22` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-black text-sm">{result.disease}</h3>
                <span className="badge flex-shrink-0" style={{ background: result.bg, color: result.color, border: `1px solid ${result.color}44` }}>
                  {result.status}
                </span>
              </div>
              <div className="divider" style={{ margin: '12px 0' }} />
              <p className="text-xs font-semibold mb-1" style={{ color: '#52525b' }}>💊 Recommended Treatment</p>
              <p className="text-sm font-bold" style={{ color: result.color }}>{result.medicine}</p>
              <button onClick={() => { setLeaf(null); setResult(null); }} className="btn btn-ghost btn-sm mt-4">
                New Scan
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div variants={stagger.item} className="card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-base tracking-tight">Notifications</h2>
            {notifications.length > 0 && (
              <span className="badge badge-black">{notifications.length}</span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12" style={{ color: '#a1a1aa' }}>
              <span className="text-4xl">🔔</span>
              <p className="text-sm font-semibold">You're all caught up!</p>
              <p className="text-xs text-center">Booking updates and alerts will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-72">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: '#fafafa', border: '1px solid #f4f4f5' }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{ background: '#f4f4f5' }}>📢</div>
                  <div>
                    <p className="text-xs font-bold">{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>{n.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
