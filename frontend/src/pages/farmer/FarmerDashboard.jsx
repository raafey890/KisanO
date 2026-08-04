import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Tractor, Store, Droplet, Bell, CloudRain, Wind, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const AnimatedCounter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeBookingsCount: 0, totalExpenses: 0 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboards/farmer');
        if (response.data?.success) {
          setStats({
            activeBookingsCount: response.data.data.activeBookingsCount || 0,
            totalExpenses: response.data.data.totalExpenses || 0
          });
          setNotifications(response.data.data.recentNotifications || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <motion.div 
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user?.name || user?.fullName || 'Farmer'}! 👋</h1>
          <p className="text-gray-500 mt-2 font-medium">Here's what's happening on your farm today.</p>
        </div>
        <div className="card flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-none px-6 py-4">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <Sun className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">32°C</div>
            <div className="text-sm font-bold text-gray-600">Clear & Sunny</div>
          </div>
          <div className="h-10 w-px bg-gray-200 mx-2"></div>
          <div className="flex gap-4 text-gray-500">
            <div className="flex flex-col items-center"><CloudRain className="w-4 h-4"/><span className="text-xs font-bold mt-1">0%</span></div>
            <div className="flex flex-col items-center"><Wind className="w-4 h-4"/><span className="text-xs font-bold mt-1">12km/h</span></div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="stat-card card-hover bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
          <h3 className="text-gray-500 font-bold mb-2">Active Bookings</h3>
          <div className="text-4xl font-black text-gray-900">
            {!loading && <AnimatedCounter target={stats.activeBookingsCount} />}
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card card-hover bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Tractor className="w-16 h-16" /></div>
          <h3 className="text-gray-500 font-bold mb-2">Total Expenses</h3>
          <div className="text-4xl font-black text-green-600 flex items-center">
            ₹{!loading && <AnimatedCounter target={stats.totalExpenses} />}
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card card-hover bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Bell className="w-16 h-16" /></div>
          <h3 className="text-gray-500 font-bold mb-2">Notifications</h3>
          <div className="text-4xl font-black text-gray-900">
            {!loading && <AnimatedCounter target={notifications.length} />}
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="section-label">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => navigate('/farmer/equipment')} className="card card-hover bg-gray-900 text-white flex flex-col items-center justify-center p-6 gap-3 group border-none cursor-pointer">
            <div className="bg-gray-800 p-4 rounded-full group-hover:scale-110 transition-transform"><Tractor className="w-8 h-8 text-white" /></div>
            <span className="font-bold">Rent Equipment</span>
          </button>
          <button onClick={() => navigate('/farmer/marketplace')} className="card card-hover bg-green-600 text-white flex flex-col items-center justify-center p-6 gap-3 group border-none cursor-pointer">
            <div className="bg-green-700 p-4 rounded-full group-hover:scale-110 transition-transform"><Store className="w-8 h-8 text-white" /></div>
            <span className="font-bold">Marketplace</span>
          </button>
          <button onClick={() => navigate('/farmer/sprayers')} className="card card-hover bg-amber-500 text-white flex flex-col items-center justify-center p-6 gap-3 group border-none cursor-pointer">
            <div className="bg-amber-600 p-4 rounded-full group-hover:scale-110 transition-transform"><Droplet className="w-8 h-8 text-white" /></div>
            <span className="font-bold">Sprayer Services</span>
          </button>
        </div>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="section-label mb-0">Recent Notifications</h2>
          <button className="btn-ghost btn-sm">View All</button>
        </div>
        <div className="card p-0 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No new notifications</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-600 mt-1"><Bell className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{notif.title || 'Notification'}</h4>
                    <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}
