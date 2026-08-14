import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiCheck, FiXCircle } from 'react-icons/fi';
import api from '../services/api';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } } },
};

export default function OwnerManage({ user }) {
  const [myEquipment, setMyEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [eqName, setEqName] = useState('');
  const [eqType, setEqType] = useState('Tractor');
  const [desc, setDesc] = useState('');
  const [hrRate, setHrRate] = useState('');
  const [dayRate, setDayRate] = useState('');
  const [category, setCategory] = useState('Ploughing');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [eqRes, bkRes] = await Promise.all([
        api.get('/equipment'),
        api.get('/bookings'),
      ]);
      if (eqRes.success) setMyEquipment(eqRes.data.items.filter(e => e.ownerId === user?.id));
      if (bkRes.success) setRequests(bkRes.data.items);
    } catch (_) {}
  }, [user]);

  useEffect(() => { setTimeout(() => loadData(), 0); }, [loadData]);

  const handleAddEq = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/equipment', {
        equipmentName: eqName, equipmentType: eqType, description: desc,
        hourlyRate: parseFloat(hrRate), dailyRate: parseFloat(dayRate),
        category, brand, model,
      });
      if (res.success) { setShowModal(false); loadData(); }
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      if (res.success) loadData();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm">Machinery Management</h3>
          <p className="text-xs mt-0.5" style={{ color: '#a1a1aa' }}>{myEquipment.length} machines registered</p>
        </div>
        <motion.button onClick={() => setShowModal(true)} className="btn btn-black" whileTap={{ scale: 0.97 }}>
          <FiPlus size={14} /> Add Machine
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My Fleet */}
        <div className="card p-6">
          <h4 className="font-black text-sm mb-4">My Fleet</h4>
          {myEquipment.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12" style={{ color: '#a1a1aa' }}>
              <span className="text-4xl">🚜</span>
              <p className="text-sm font-semibold">No machines listed yet.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-black btn-sm">Add First Machine</button>
            </div>
          ) : (
            <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col gap-3">
              {myEquipment.map(eq => (
                <motion.div key={eq.id} variants={stagger.item}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: '#fafafa', border: '1px solid #f4f4f5' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{eq.equipmentType === 'Tractor' ? '🚜' : eq.equipmentType === 'Harvester' ? '🌾' : '⚙️'}</span>
                    <div>
                      <p className="text-sm font-bold">{eq.equipmentName}</p>
                      <p className="text-xs" style={{ color: '#a1a1aa' }}>₹{eq.hourlyRate}/hr · ₹{eq.dailyRate}/day</p>
                    </div>
                  </div>
                  <span className={`badge ${eq.equipmentStatus === 'Available' ? 'badge-green' : 'badge-amber'}`}>
                    {eq.equipmentStatus}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Booking Requests */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-sm">Booking Requests</h4>
            {requests.filter(r => r.bookingStatus === 'Pending').length > 0 && (
              <span className="badge badge-amber">
                {requests.filter(r => r.bookingStatus === 'Pending').length} pending
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12" style={{ color: '#a1a1aa' }}>
              <span className="text-4xl">📋</span>
              <p className="text-sm font-semibold">No booking requests yet.</p>
            </div>
          ) : (
            <motion.div variants={stagger.container} initial="initial" animate="animate"
              className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {requests.map(req => (
                <motion.div key={req.id} variants={stagger.item}
                  className="p-4 rounded-xl" style={{ background: '#fafafa', border: '1px solid #f4f4f5' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-bold">Booking #{req.id}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>
                        {new Date(req.rentalStartDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <span className={`badge flex-shrink-0 ${req.bookingStatus === 'Approved' ? 'badge-green' : req.bookingStatus === 'Pending' ? 'badge-amber' : 'badge-red'}`}>
                      {req.bookingStatus}
                    </span>
                  </div>
                  <p className="text-sm font-black" style={{ color: '#16a34a' }}>₹{req.totalAmount}</p>

                  {req.bookingStatus === 'Pending' && (
                    <div className="flex gap-2 mt-3">
                      <motion.button onClick={() => updateStatus(req.id, 'Approved')}
                        className="btn btn-black btn-sm flex-1" whileTap={{ scale: 0.96 }}>
                        <FiCheck size={12} /> Approve
                      </motion.button>
                      <motion.button onClick={() => updateStatus(req.id, 'Rejected')}
                        className="btn btn-danger btn-sm flex-1" whileTap={{ scale: 0.96 }}>
                        <FiXCircle size={12} /> Reject
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Equipment Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25 }} className="modal-box">
              <div className="modal-header flex items-center justify-between">
                <h2 className="font-black text-base">Register New Machine</h2>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-icon"><FiX size={16} /></button>
              </div>
              <form onSubmit={handleAddEq}>
                <div className="modal-body flex flex-col gap-4">
                  <div><p className="section-label">Equipment Name</p>
                    <input required value={eqName} onChange={e => setEqName(e.target.value)} className="field" placeholder="e.g. John Deere 5050D" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="section-label">Type</p>
                      <select value={eqType} onChange={e => setEqType(e.target.value)} className="field">
                        <option>Tractor</option><option>Harvester</option><option>Seeder</option>
                      </select></div>
                    <div><p className="section-label">Category</p>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="field">
                        <option>Ploughing</option><option>Harvesting</option><option>Sowing</option>
                      </select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="section-label">Brand</p>
                      <input value={brand} onChange={e => setBrand(e.target.value)} className="field" placeholder="Mahindra" /></div>
                    <div><p className="section-label">Model</p>
                      <input value={model} onChange={e => setModel(e.target.value)} className="field" placeholder="575 DI" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="section-label">Hourly Rate (₹)</p>
                      <input required type="number" value={hrRate} onChange={e => setHrRate(e.target.value)} className="field" placeholder="350" /></div>
                    <div><p className="section-label">Daily Rate (₹)</p>
                      <input required type="number" value={dayRate} onChange={e => setDayRate(e.target.value)} className="field" placeholder="2500" /></div>
                  </div>
                  <div><p className="section-label">Description</p>
                    <textarea required value={desc} onChange={e => setDesc(e.target.value)} className="field" style={{ height: 80 }} placeholder="Condition, tools included, etc." /></div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <motion.button type="submit" disabled={loading} className="btn btn-black flex-1" whileTap={{ scale: 0.97 }}>
                    {loading ? 'Registering...' : 'Register Machine'}
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
