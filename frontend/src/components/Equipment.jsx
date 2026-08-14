import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiX, FiCheck, FiMapPin } from 'react-icons/fi';
import api from '../services/api';

const SLOTS = [
  { id: 1, label: '6:00 AM – 8:00 AM', start: 6 },
  { id: 2, label: '8:00 AM – 10:00 AM', start: 8 },
  { id: 3, label: '10:00 AM – 12:00 PM', start: 10 },
  { id: 4, label: '12:00 PM – 2:00 PM', start: 12 },
  { id: 5, label: '2:00 PM – 4:00 PM', start: 14 },
  { id: 6, label: '4:00 PM – 6:00 PM', start: 16 },
];

const EQ_ICONS = { Tractor: '🚜', Harvester: '🌾', Seeder: '🌱', default: '⚙️' };

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } },
};

export default function Equipment() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [eqType, setEqType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedEq, setSelectedEq] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockedStarts, setBlockedStarts] = useState([]);
  const [pickedSlot, setPickedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const res = await api.get('/equipment', { params: { search, eq_type: eqType || undefined, sortBy: sortBy || undefined } });
      if (res.success) setList(res.data.items);
    } catch (_) {}
  }, [search, eqType, sortBy]);

  useEffect(() => { setTimeout(() => fetchList(), 0); }, [fetchList]);

  const openEq = async (eq) => {
    setSelectedEq(eq); setPickedSlot(null);
    fetchBlocked(eq.id, date);
  };

  const fetchBlocked = async (eqId, d) => {
    try {
      const res = await api.get('/bookings', { params: { status: 'Approved' } });
      if (res.success) {
        const matchDate = new Date(d).toDateString();
        const starts = res.data.items
          .filter(b => b.equipmentId === eqId && new Date(b.rentalStartDate).toDateString() === matchDate)
          .map(b => new Date(b.rentalStartDate).getHours());
        setBlockedStarts(starts);
      }
    } catch (_) {}
  };

  const handleBook = async () => {
    if (!selectedEq || !pickedSlot) return;
    setLoading(true);
    try {
      const start = new Date(`${date}T${String(pickedSlot.start).padStart(2, '0')}:00:00`);
      const end   = new Date(`${date}T${String(pickedSlot.start + 2).padStart(2, '0')}:00:00`);
      const res = await api.post('/bookings', {
        equipmentId: selectedEq.id,
        rentalStartDate: start.toISOString(),
        rentalEndDate: end.toISOString(),
        farmerNote: 'Booked via KisanO web app',
      });
      if (res.success) {
        setPickedSlot(null);
        fetchBlocked(selectedEq.id, date);
        alert('✅ Booking requested successfully!');
      }
    } catch (err) {
      alert(err.message || 'Booking failed. Slot may be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Filter Bar ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#a1a1aa' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="field !pl-9" placeholder="Search tractors, harvesters..." />
        </div>
        <div className="flex gap-2">
          <select value={eqType} onChange={e => setEqType(e.target.value)} className="field">
            <option value="">All Types</option>
            <option value="Tractor">Tractors</option>
            <option value="Harvester">Harvesters</option>
            <option value="Seeder">Seeders</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="field">
            <option value="">Sort By</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Equipment Grid ── */}
        <motion.div variants={stagger.container} initial="initial" animate="animate"
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {list.length === 0 && (
            <div className="col-span-2 card p-16 flex flex-col items-center gap-3" style={{ color: '#a1a1aa' }}>
              <span className="text-5xl">🚜</span>
              <p className="font-semibold">No equipment found matching your search.</p>
            </div>
          )}
          {list.map(eq => (
            <motion.div key={eq.id} variants={stagger.item} className="card card-hover overflow-hidden flex flex-col cursor-pointer"
              onClick={() => openEq(eq)}>
              {/* thumbnail */}
              <div className="h-40 flex items-center justify-center text-6xl"
                style={{ background: 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)' }}>
                {EQ_ICONS[eq.equipmentType] || EQ_ICONS.default}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-black text-sm leading-tight">{eq.equipmentName}</h3>
                  <span className={`badge flex-shrink-0 ${eq.equipmentStatus === 'Available' ? 'badge-green' : 'badge-amber'}`}>
                    {eq.equipmentStatus}
                  </span>
                </div>
                <p className="text-xs mb-4 line-clamp-2" style={{ color: '#71717a' }}>{eq.description}</p>
                <div className="divider" />
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="font-black text-base">₹{eq.hourlyRate}</span>
                    <span className="text-xs font-medium" style={{ color: '#a1a1aa' }}>/hr</span>
                    <div className="text-xs" style={{ color: '#a1a1aa' }}>₹{eq.dailyRate}/day</div>
                  </div>
                  <motion.button
                    onClick={e => { e.stopPropagation(); openEq(eq); }}
                    className="btn btn-black btn-sm"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiClock size={12} /> Book Slot
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Booking Sidebar Panel ── */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {!selectedEq ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="card flex flex-col items-center justify-center gap-4 py-20 text-center h-full min-h-80"
                style={{ color: '#a1a1aa' }}>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl">🗓️</motion.span>
                <p className="font-semibold text-sm">Select a machine to book hourly slots</p>
              </motion.div>
            ) : (
              <motion.div key="booking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                className="card p-6 flex flex-col gap-5 sticky top-20"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-sm">{selectedEq.equipmentName}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#16a34a' }}>₹{selectedEq.hourlyRate}/hour</p>
                  </div>
                  <button onClick={() => setSelectedEq(null)} className="btn btn-ghost btn-icon"><FiX size={15} /></button>
                </div>

                {/* Date picker */}
                <div>
                  <p className="section-label">Select Date</p>
                  <input type="date" value={date} min={new Date().toISOString().split('T')[0]}
                    onChange={e => { setDate(e.target.value); fetchBlocked(selectedEq.id, e.target.value); }}
                    className="field" />
                </div>

                {/* Slots */}
                <div>
                  <p className="section-label">Available Slots (2-hr blocks)</p>
                  <div className="flex flex-col gap-2">
                    {SLOTS.map(slot => {
                      const booked = blockedStarts.includes(slot.start);
                      const picked = pickedSlot?.id === slot.id;
                      return (
                        <motion.button
                          key={slot.id}
                          disabled={booked}
                          onClick={() => !booked && setPickedSlot(slot)}
                          className={`time-slot ${booked ? 'booked' : ''} ${picked ? 'selected' : ''}`}
                          whileTap={!booked ? { scale: 0.98 } : {}}
                        >
                          <span>{slot.label}</span>
                          <span className="text-xs font-bold">
                            {booked ? 'Booked' : picked ? <FiCheck /> : 'Free'}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm */}
                <AnimatePresence>
                  {pickedSlot && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-2">
                      <div className="rounded-xl p-3 text-xs font-semibold" style={{ background: '#f0fdf4', color: '#15803d' }}>
                        📅 {pickedSlot.label} • ₹{selectedEq.hourlyRate * 2} estimated
                      </div>
                      <motion.button onClick={handleBook} disabled={loading}
                        className="btn btn-black w-full" whileTap={{ scale: 0.97 }}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
