import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Package, Truck, 
  RefreshCw, Star, Download, Eye, XCircle, ShoppingBag, 
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { TractorEquipment } from '../../assets/images';
import npkFertilizerImg from '../../assets/products/npk_fertilizer.jpg';
import tomatoSeedsImg from '../../assets/products/tomato_seeds.jpg';
import dripIrrigationImg from '../../assets/products/drip_irrigation.jpg';
import mangoSeedlingImg from '../../assets/products/mango_seedling.jpg';

const TABS = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const MOCK_ORDERS = [
  {
    id: 'ORD-123456',
    date: '29 Jul 2026',
    status: 'Shipped',
    price: 1200,
    product: {
      name: 'Organic NPK Fertilizer (50kg)',
      image: npkFertilizerImg,
      seller: 'GreenFarm Organics'
    }
  },
  {
    id: 'ORD-789456',
    date: '28 Jul 2026',
    status: 'Delivered',
    price: 450,
    product: {
      name: 'Premium Hybrid Tomato Seeds (100g)',
      image: tomatoSeedsImg,
      seller: 'Kisan Seeds Co.'
    }
  },
  {
    id: 'ORD-445566',
    date: '25 Jul 2026',
    status: 'Processing',
    price: 3400,
    product: {
      name: 'Drip Irrigation Starter Kit',
      image: dripIrrigationImg,
      seller: 'AquaFlow Solutions'
    }
  },
  {
    id: 'ORD-998877',
    date: '20 Jul 2026',
    status: 'Cancelled',
    price: 600,
    product: {
      name: 'Mango Seedlings (Alphonso) - Pack of 5',
      image: mangoSeedlingImg,
      seller: 'Ratnagiri Nursery'
    }
  }
];

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesTab = activeTab === 'All Orders' || order.status === activeTab;
    const matchesSearch = order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <div className="flex flex-col gap-6 pt-4 sm:pt-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500 mt-2">
            Track and manage all your marketplace purchases.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:flex-1 flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-green-500 focus-within:shadow-sm transition-all group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 font-medium ml-3 w-full"
              placeholder="Search by product name or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="w-full sm:w-auto h-14 px-6 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap border-2 ${
              activeTab === tab 
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. ORDERS LIST */}
      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <motion.div 
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-5"
              >
                {/* Order Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                      {order.id}
                    </span>
                    <span className="text-sm font-bold text-gray-500">
                      Ordered: {order.date}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  
                  {/* Image */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img 
                      src={order.product.image} 
                      alt={order.product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = TractorEquipment }} 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug line-clamp-2">
                      {order.product.name}
                    </h3>
                    <p className="text-sm font-bold text-gray-500">
                      Seller: <span className="text-gray-900">{order.product.seller}</span>
                    </p>
                    <span className="text-2xl font-black text-gray-900 mt-2">
                      ₹{order.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Buttons Group */}
                  <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    
                    {order.status === 'Shipped' && (
                      <button className="w-full sm:w-40 h-10 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4" /> Track Order
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <button className="w-full sm:w-40 h-10 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" /> Rate Product
                      </button>
                    )}

                    {(order.status === 'Cancelled' || order.status === 'Delivered') && (
                      <button className="w-full sm:w-40 h-10 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Reorder
                      </button>
                    )}

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:w-20 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" /> View
                      </button>
                      
                      {order.status !== 'Cancelled' && (
                        <button className="flex-1 sm:w-20 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1">
                          <Download className="w-4 h-4" /> Invoice
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-8">
                {searchQuery || activeTab !== 'All Orders' 
                  ? "We couldn't find any orders matching your current filters." 
                  : "You haven't purchased any farming products from the marketplace yet."}
              </p>
              <button 
                onClick={() => navigate('/farmer/marketplace')}
                className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
              >
                Browse Marketplace
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
