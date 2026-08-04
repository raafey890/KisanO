import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiUser, FiPhone, FiLock, FiMail, FiMapPin, FiChevronDown } from 'react-icons/fi';
import api from '../services/api';

const ROLES = [
  { value: 'FARMER', label: 'Farmer', icon: '🌾', desc: 'Rent equipment & buy seedlings' },
  { value: 'EQUIPMENT_OWNER', label: 'Equipment Owner', icon: '🚜', desc: 'List and monetize your machinery' },
];

export default function Auth({ onLoginSuccess }) {
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('FARMER');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const params = new URLSearchParams();
        params.append('username', mobile);
        params.append('password', password);
        const res = await api.post('/auth/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        if (res.success) onLoginSuccess(res.data.user, res.data.access_token);
      } else {
        const res = await api.post('/auth/register', {
          fullName, mobileNumber: mobile, password,
          email: email || null, role, village, district, state,
        });
        if (res.success) {
          setTab('login');
          setError('');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #000 0%, #18181b 100%)' }}>

      {/* Left Hero Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between flex-1 p-14 text-white"
      >
        <div>
          {/* ── Animated KisanO Logo ── */}
          <KisanOLogo />
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-5xl font-black leading-tight mb-6"
          >
            India's Premium<br />
            <span style={{ color: '#16a34a' }}>Agriculture</span><br />
            Platform
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-4"
          >
            {[
              { icon: '🚜', text: 'Rent tractors & harvesters by the hour' },
              { icon: '🌱', text: 'Trade paddy seedlings (Naruu) locally' },
              { icon: '💨', text: 'Book certified pesticide sprayers' },
              { icon: '🩺', text: 'AI-powered crop disease detection' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-3 text-sm font-medium"
                style={{ color: '#a1a1aa' }}
              >
                <span className="text-lg">{f.icon}</span>
                {f.text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs font-medium" style={{ color: '#52525b' }}>
          © 2025 KisanO. Empowering Indian Agriculture.
        </p>
      </motion.div>

      {/* Right Auth Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center w-full lg:w-[480px] p-6"
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{ background: '#ffffff' }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <KisanOLogo compact />
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 p-1 rounded-xl mb-8" style={{ background: '#f4f4f5' }}>
            {['login', 'register'].map((t) => (
              <motion.button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all"
                style={{
                  background: tab === t ? '#000' : 'transparent',
                  color: tab === t ? '#fff' : '#71717a',
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl text-xs font-semibold"
                style={{ background: '#fef2f2', color: '#b91c1c', borderLeft: '3px solid #dc2626' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {/* ─── REGISTER FIELDS ─── */}
              {tab === 'register' && (
                <>
                  <FieldRow icon={<FiUser />} label="Full Name">
                    <input required value={fullName} onChange={e => setFullName(e.target.value)}
                      className="field" placeholder="Your full name" />
                  </FieldRow>

                  {/* Role selector cards */}
                  <div>
                    <p className="section-label" style={{ marginBottom: 10 }}>Account type</p>
                    <div className="flex gap-3">
                      {ROLES.map(r => (
                        <motion.button
                          key={r.value}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setRole(r.value)}
                          className="flex-1 p-3 rounded-xl text-left border-2 transition-all"
                          style={{
                            borderColor: role === r.value ? '#000' : '#e4e4e7',
                            background: role === r.value ? '#000' : '#fff',
                            color: role === r.value ? '#fff' : '#27272a',
                          }}
                        >
                          <div className="text-lg mb-1">{r.icon}</div>
                          <div className="text-xs font-bold">{r.label}</div>
                          <div className="text-[10px] mt-0.5 opacity-60">{r.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ─── COMMON FIELDS ─── */}
              <FieldRow icon={<FiPhone />} label="Mobile Number">
                <input required type="tel" pattern="[0-9]{10}" value={mobile} onChange={e => setMobile(e.target.value)}
                  className="field" placeholder="10-digit mobile" />
              </FieldRow>

              <FieldRow icon={<FiLock />} label="Password">
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="field" placeholder="Password (min 6 chars)" minLength={6} />
              </FieldRow>

              {/* ─── REGISTER-ONLY FIELDS ─── */}
              {tab === 'register' && (
                <>
                  <FieldRow icon={<FiMail />} label="Email (Optional)">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="field" placeholder="Email address" />
                  </FieldRow>

                  <div>
                    <p className="section-label" style={{ marginBottom: 10 }}>Location</p>
                    <div className="flex gap-2">
                      <input required value={village} onChange={e => setVillage(e.target.value)}
                        className="field" placeholder="Village" />
                      <input required value={district} onChange={e => setDistrict(e.target.value)}
                        className="field" placeholder="District" />
                      <input required value={state} onChange={e => setState(e.target.value)}
                        className="field" placeholder="State" />
                    </div>
                  </div>
                </>
              )}

              {/* ─── SUBMIT ─── */}
              <motion.button
                type="submit"
                disabled={loading}
                className="btn btn-black w-full mt-2"
                whileTap={{ scale: 0.97 }}
                style={{ fontSize: 15, padding: '14px 20px' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoadingDots /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                    <FiArrowRight />
                  </span>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function FieldRow({ icon, label, children }) {
  return (
    <div>
      <p className="section-label" style={{ marginBottom: 7 }}>
        <span className="inline-flex items-center gap-1.5">{icon} {label}</span>
      </p>
      {children}
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.span
          key={i}
          className="block w-1.5 h-1.5 rounded-full bg-white"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: d }}
        />
      ))}
    </span>
  );
}

/* ============================================================
   KISANO ANIMATED LOGO COMPONENT
   Stage 1 — 🌾 leaf drops in with spring bounce
   Stage 2 — Each letter K·i·s·a·n·O slides up with stagger
   Stage 3 — Green underline draws itself left → right
   ============================================================ */
function KisanOLogo({ compact = false }) {
  const letters = ['K', 'i', 's', 'a', 'n', 'O'];

  const iconVariant = {
    initial: { opacity: 0, y: -30, rotate: -20, scale: 0.4 },
    animate: {
      opacity: 1, y: 0, rotate: 0, scale: 1,
      transition: { type: 'spring', stiffness: 240, damping: 16, delay: 0.25 },
    },
  };

  const containerVariant = {
    initial: {},
    animate: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } },
  };

  const letterVariant = {
    initial: { opacity: 0, y: 24, skewX: 8 },
    animate: {
      opacity: 1, y: 0, skewX: 0,
      transition: { type: 'spring', stiffness: 280, damping: 20 },
    },
  };

  const lineVariant = {
    initial: { scaleX: 0, originX: 0 },
    animate: {
      scaleX: 1,
      transition: { delay: 1.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const iconSize   = compact ? 26 : 30;
  const fontSize   = compact ? 22 : 26;
  const lineWidth  = compact ? 86  : 106;
  const lineOffset = compact ? 0   : 38;

  return (
    <div className={`flex flex-col ${compact ? 'items-center' : 'items-start'}`}>
      <div className="flex items-center gap-2.5">

        {/* Stage 1 – Bouncing leaf emoji */}
        <motion.span
          variants={iconVariant}
          initial="initial"
          animate="animate"
          style={{
            fontSize: iconSize,
            display: 'inline-block',
            transformOrigin: 'bottom center',
            lineHeight: 1,
          }}
        >
          🌾
        </motion.span>

        {/* Stage 2 – Staggered letter reveal */}
        <motion.div
          variants={containerVariant}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', alignItems: 'baseline', overflow: 'hidden' }}
        >
          {letters.map((l, i) => (
            <motion.span
              key={i}
              variants={letterVariant}
              style={{
                display: 'inline-block',
                fontSize,
                fontWeight: 900,
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
                color: l === 'O' ? '#16a34a' : '#ffffff',
              }}
            >
              {l}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Stage 3 – Glowing underline draws from left */}
      <motion.div
        variants={lineVariant}
        initial="initial"
        animate="animate"
        style={{
          height: 2.5,
          width: lineWidth,
          marginLeft: lineOffset,
          marginTop: 3,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #16a34a 0%, #4ade80 100%)',
          boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
        }}
      />
    </div>
  );
}

