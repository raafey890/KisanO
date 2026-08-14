import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiPhone, FiX, FiMapPin, FiPackage } from 'react-icons/fi';
import { useNaruuListings, useCreateNaruu, useDeleteNaruu } from '../features/marketplace/hooks/useNaruu';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } },
};

export default function Marketplace({ user }) {
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [cropName, setCropName] = useState('Paddy Seedlings (Naruu)');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState(user?.mobileNumber || '');
  const [vInput, setVInput] = useState(user?.village || '');
  const [dInput, setDInput] = useState(user?.district || '');
  const [sInput, setSInput] = useState(user?.state || '');

  const { data: listings = [], isLoading, isError, refetch } = useNaruuListings(district, village);
  const createNaruu = useCreateNaruu();
  const deleteNaruu = useDeleteNaruu();

  const handleCreate = async (e) => {
    e.preventDefault();
    createNaruu.mutate({
      cropName, 
      qty: parseInt(qty).toString(), 
      price: parseFloat(price).toString(),
      village: vInput, 
      district: dInput, 
      state: sInput, 
      phone,
    }, {
      onSuccess: () => {
        setShowModal(false);
        resetForm();
      },
      onError: (err) => {
        alert(err.message);
      }
    });
  };

  const handleSold = (id) => {
    deleteNaruu.mutate(id, {
      onError: (err) => alert(err.message)
    });
  };

  const resetForm = () => { setQty(''); setPrice(''); };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter + CTA bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <input value={village} onChange={e => setVillage(e.target.value)} className="field" placeholder="🏘️ Village..." />
          <input value={district} onChange={e => setDistrict(e.target.value)} className="field" placeholder="📍 District..." />
        </div>
        <motion.button onClick={() => setShowModal(true)} className="btn btn-black sm:w-auto" whileTap={{ scale: 0.97 }}>
          <FiPlus size={15} /> Post Seedlings (Naruu)
        </motion.button>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">Loading seedlings...</div>
      ) : isError ? (
        <div className="flex flex-col items-center p-12 text-red-500">
          <p>Failed to load seedlings.</p>
          <button onClick={() => refetch()} className="btn btn-outline mt-4">Retry</button>
        </div>
      ) : listings.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="card p-20 flex flex-col items-center gap-4" style={{ color: '#a1a1aa' }}>
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl">🌱</motion.span>
          <p className="font-semibold">No seedling listings in this area yet.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-green">Be the first to post</button>
        </motion.div>
      ) : (
        <motion.div variants={stagger.container} initial="initial" animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map(lst => (
            <motion.div key={lst._id || lst.id} variants={stagger.item} className="card card-hover p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#f0fdf4' }}>🌾</div>
                <span className={`badge ${lst.listingStatus === 'Active' ? 'badge-green' : 'badge-grey'}`}>{lst.listingStatus || 'Active'}</span>
              </div>
              <h3 className="font-black text-sm mb-1">{lst.cropName}</h3>
              <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: '#71717a' }}>
                <FiMapPin size={11} />{lst.village}, {lst.district}
              </div>
              <div className="flex items-center gap-3 text-xs mb-4" style={{ color: '#52525b' }}>
                <div className="flex items-center gap-1"><FiPackage size={11} /> {lst.qty || lst.quantity} bundles</div>
              </div>
              <div className="divider" />
              <div className="flex items-center justify-between pt-3">
                <div>
                  <span className="font-black text-lg">₹{lst.price}</span>
                  <span className="text-xs ml-1" style={{ color: '#a1a1aa' }}>/bundle</span>
                </div>
                {lst.sellerId === user?.id ? (
                  <button onClick={() => handleSold(lst._id || lst.id)} disabled={deleteNaruu.isPending} className="btn btn-danger btn-sm">
                    {deleteNaruu.isPending ? 'Deleting...' : 'Mark Sold'}
                  </button>
                ) : (
                  <a href={`tel:${lst.phone || lst.contactPhone}`} className="btn btn-green btn-sm">
                    <FiPhone size={12} /> Call
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="modal-box">
              <div className="modal-header flex items-center justify-between">
                <h2 className="font-black text-base">Post Excess Naruu</h2>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-icon"><FiX size={16} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body flex flex-col gap-4">
                  <div>
                    <p className="section-label">Crop type</p>
                    <input required value={cropName} onChange={e => setCropName(e.target.value)} className="field" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="section-label">Quantity (bundles)</p>
                      <input required type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} className="field" placeholder="e.g. 50" /></div>
                    <div><p className="section-label">Price / bundle (₹)</p>
                      <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} className="field" placeholder="e.g. 15" /></div>
                  </div>
                  <div><p className="section-label">Contact mobile</p>
                    <input required type="tel" pattern="[0-9]{10}" value={phone} onChange={e => setPhone(e.target.value)} className="field" /></div>
                  <div className="grid grid-cols-3 gap-2">
                    <input required value={vInput} onChange={e => setVInput(e.target.value)} className="field" placeholder="Village" />
                    <input required value={dInput} onChange={e => setDInput(e.target.value)} className="field" placeholder="District" />
                    <input required value={sInput} onChange={e => setSInput(e.target.value)} className="field" placeholder="State" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <motion.button type="submit" disabled={createNaruu.isPending} className="btn btn-black flex-1" whileTap={{ scale: 0.97 }}>
                    {createNaruu.isPending ? 'Posting...' : 'Post Listing'}
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
