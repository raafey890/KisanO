import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import api from '../services/api';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } },
};

const EQ_TYPES = ['Knapsack Sprayer', 'Power Sprayer', 'Agriculture Spraying Drone'];

export default function Sprayers({ user }) {
  const [sprayers, setSprayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expYears, setExpYears] = useState('');
  const [eqType, setEqType] = useState('Power Sprayer');
  const [capacity, setCapacity] = useState('');
  const [rate, setRate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSprayers = useCallback(async () => {
    try {
      const res = await api.get('/sprayers');
      if (res.success) setSprayers(res.data.items);
    } catch (_) {}
  }, []);

  useEffect(() => { setTimeout(() => fetchSprayers(), 0); }, [fetchSprayers]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/sprayers', {
        experienceYears: parseInt(expYears), equipmentType: eqType,
        dailyCapacityAcres: parseFloat(capacity), ratePerAcre: parseFloat(rate),
        availableAreas: [user.village, user.district],
      });
      if (res.success) { setShowModal(false); fetchSprayers(); }
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Top bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-sm">Hire Crop Medicine Specialists</h3>
          <p className="text-xs mt-0.5" style={{ color: '#a1a1aa' }}>Verified local pesticide & fertilizer spraying experts</p>
        </div>
        <motion.button onClick={() => setShowModal(true)} className="btn btn-black flex-shrink-0" whileTap={{ scale: 0.97 }}>
          <FiPlus size={14} /> Register as Sprayer
        </motion.button>
      </motion.div>

      {/* Grid */}
      {sprayers.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="card p-20 flex flex-col items-center gap-4" style={{ color: '#a1a1aa' }}>
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl">💨</motion.span>
          <p className="font-semibold">No sprayer workers registered in this area.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-green">Register Yourself</button>
        </motion.div>
      ) : (
        <motion.div variants={stagger.container} initial="initial" animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sprayers.map(sp => (
            <motion.div key={sp.id} variants={stagger.item} className="card card-hover p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: '#f4f4f5' }}>💨</div>
                {sp.isVerified && (
                  <span className="badge badge-green">
                    <FiCheck size={10} /> Verified
                  </span>
                )}
              </div>
              <h3 className="font-black text-sm mb-3">Sprayer Agent #{sp.id}</h3>

              <div className="flex flex-col gap-1.5 mb-4">
                {[
                  ['Equipment', sp.equipmentType],
                  ['Capacity', `${sp.dailyCapacityAcres} acres/day`],
                  ['Experience', `${sp.experienceYears} years`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span style={{ color: '#a1a1aa' }}>{k}</span>
                    <span className="font-semibold" style={{ color: '#27272a' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={12} fill={s <= Math.round(sp.rating) ? '#f59e0b' : 'none'}
                    style={{ color: s <= Math.round(sp.rating) ? '#f59e0b' : '#d4d4d8' }} />
                ))}
                <span className="text-xs font-bold ml-1" style={{ color: '#71717a' }}>{sp.rating}</span>
              </div>

              <div className="divider" />
              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="font-black text-lg">₹{sp.ratePerAcre}</span>
                  <span className="text-xs ml-1" style={{ color: '#a1a1aa' }}>/acre</span>
                </div>
                <motion.button onClick={() => alert(`Booking Sprayer #${sp.id}. Contact routing requested.`)}
                  className="btn btn-black btn-sm" whileTap={{ scale: 0.95 }}>
                  Book Service
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Register Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25 }} className="modal-box">
              <div className="modal-header flex items-center justify-between">
                <h2 className="font-black text-base">Register as Sprayer Agent</h2>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-icon"><FiX size={16} /></button>
              </div>
              <form onSubmit={handleRegister}>
                <div className="modal-body flex flex-col gap-4">
                  <div><p className="section-label">Equipment Type</p>
                    <select value={eqType} onChange={e => setEqType(e.target.value)} className="field">
                      {EQ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><p className="section-label">Years of Experience</p>
                    <input required type="number" min="0" value={expYears} onChange={e => setExpYears(e.target.value)} className="field" placeholder="e.g. 3" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="section-label">Daily Capacity (acres)</p>
                      <input required type="number" step="0.5" value={capacity} onChange={e => setCapacity(e.target.value)} className="field" placeholder="e.g. 5" /></div>
                    <div><p className="section-label">Rate per Acre (₹)</p>
                      <input required type="number" value={rate} onChange={e => setRate(e.target.value)} className="field" placeholder="e.g. 150" /></div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <motion.button type="submit" disabled={loading} className="btn btn-black flex-1" whileTap={{ scale: 0.97 }}>
                    {loading ? 'Registering...' : 'Register'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
