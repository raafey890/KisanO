import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Tractor, MoreVertical, Wrench, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FleetManagement = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const response = await api.get('/equipment');
        if (response.data?.success) {
          const myFleet = response.data.data.filter(eq => eq.ownerId === user?.id);
          setEquipment(myFleet);
        }
      } catch (error) {
        console.error("Error fetching fleet", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getEmoji = (type) => {
    if (type?.toLowerCase().includes('tractor')) return '🚜';
    if (type?.toLowerCase().includes('harvester')) return '🌾';
    if (type?.toLowerCase().includes('seeder')) return '🌱';
    return '🔧';
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Machinery Fleet</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your equipment and availability</p>
        </div>
        <Link to="/owner/fleet/add" className="btn btn-black flex items-center gap-2">
          <Plus size={20} />
          <span>Add Machine</span>
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : equipment.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Tractor size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No machines listed yet</h3>
          <p className="text-gray-500 font-medium mb-6">Add your first machine to start earning.</p>
          <Link to="/owner/fleet/add" className="btn btn-black inline-flex items-center gap-2">
            <Plus size={20} />
            <span>Add Equipment</span>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <div key={item.id || item._id} className="card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getEmoji(item.equipmentType)}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.equipmentName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{item.brand} {item.model}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="divider border-t border-gray-100 my-4"></div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Hourly</p>
                  <p className="font-black text-gray-900">₹{item.hourlyRate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Daily</p>
                  <p className="font-black text-gray-900">₹{item.dailyRate}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className={`badge ${item.equipmentStatus === 'Maintenance' ? 'badge-amber' : 'badge-green'} flex items-center gap-1.5`}>
                  {item.equipmentStatus === 'Maintenance' ? <Wrench size={14} /> : <CheckCircle size={14} />}
                  {item.equipmentStatus || 'Available'}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Toggle Status</span>
                  <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.equipmentStatus === 'Maintenance' ? 'bg-amber-400' : 'bg-green-500'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.equipmentStatus === 'Maintenance' ? 'translate-x-0' : 'translate-x-4'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FleetManagement;
