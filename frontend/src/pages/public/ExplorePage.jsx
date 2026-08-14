import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { 
  Tractor, 
  ShoppingBag, 
  Wind, 
  MapPin, 
  Star,
  Clock,
  Search,
  Phone,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const tabs = [
  { id: 'equipment', label: 'Equipment Rental', icon: Tractor, img: '/assets/cat_equipment.jpg' },
  { id: 'marketplace', label: 'Produce & Seedlings', icon: ShoppingBag, img: '/assets/cat_seedlings.jpg' },
  { id: 'sprayers', label: 'Certified Sprayers', icon: Wind, img: '/assets/cat_sprayers.jpg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'equipment';
  const initialSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [filterText, setFilterText] = useState(initialSearch);
  const [data, setData] = useState({ equipment: [], marketplace: [], sprayers: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [prevSearch, setPrevSearch] = useState(searchParams);

  if (searchParams !== prevSearch) {
    setPrevSearch(searchParams);
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab && ['equipment', 'marketplace', 'sprayers'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eqRes, mrktRes, sprRes] = await Promise.allSettled([
          api.get('/equipment'),
          api.get('/naruu'),
          api.get('/sprayers')
        ]);

        const extractItems = (res) => {
          if (res.status === 'fulfilled' && res.value) {
            const raw = res.value;
            if (Array.isArray(raw)) return raw;
            if (raw.items && Array.isArray(raw.items)) return raw.items;
            if (raw.data && Array.isArray(raw.data.items)) return raw.data.items;
            if (raw.data && Array.isArray(raw.data)) return raw.data;
          }
          return [];
        };
        
        setData({
          equipment: extractItems(eqRes),
          marketplace: extractItems(mrktRes),
          sprayers: extractItems(sprRes),
        });
      } catch (error) {
        console.error("Failed to fetch explore data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (activeTab === 'equipment') {
      const filtered = data.equipment.filter(e => 
        !filterText || e.equipmentName?.toLowerCase().includes(filterText.toLowerCase()) ||
        e.equipmentType?.toLowerCase().includes(filterText.toLowerCase())
      );

      return (
        <motion.div 
          key="equipment"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-200">
              <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-black text-gray-800">No machinery listings found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search query</p>
            </div>
          ) : filtered.map((item) => (
            <motion.div 
              key={item.id || item._id} 
              variants={itemVariants} 
              className="card card-hover bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all"
            >
              {/* Card Image */}
              <div className="h-52 relative overflow-hidden bg-gray-100">
                <img 
                  src={item.equipmentType === 'Harvester' ? '/assets/hero_farm.jpg' : '/assets/cat_equipment.jpg'} 
                  alt={item.equipmentName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className={`absolute top-4 right-4 badge font-black text-xs px-3 py-1 rounded-full ${item.equipmentStatus === 'Available' ? 'badge-green' : 'badge-amber'}`}>
                  {item.equipmentStatus || 'Available'}
                </div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {item.equipmentType || 'Machinery'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-gray-900 mb-2">{item.equipmentName}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <span className="text-2xl font-black text-gray-900">₹{item.hourlyRate}</span>
                      <span className="text-xs text-gray-500 font-bold"> / hr</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-500">
                      ₹{item.dailyRate} / day
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/farmer/login')}
                    className="btn btn-black w-full justify-center flex items-center gap-2 text-sm font-black uppercase py-3"
                  >
                    <span>Sign In to Book</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    if (activeTab === 'marketplace') {
      const filtered = data.marketplace.filter(m => 
        !filterText || m.cropName?.toLowerCase().includes(filterText.toLowerCase()) ||
        m.village?.toLowerCase().includes(filterText.toLowerCase()) ||
        m.district?.toLowerCase().includes(filterText.toLowerCase())
      );

      return (
        <motion.div 
          key="marketplace"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-200">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-black text-gray-800">No produce listings found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search query</p>
            </div>
          ) : filtered.map((item) => (
            <motion.div 
              key={item.id || item._id} 
              variants={itemVariants} 
              className="card card-hover bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-52 relative overflow-hidden bg-gray-100">
                <img 
                  src={item.cropName?.toLowerCase().includes('seed') ? '/assets/cat_seeds.jpg' : '/assets/cat_seedlings.jpg'} 
                  alt={item.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 badge badge-green font-black text-xs px-3 py-1 rounded-full">
                  {item.listingStatus || 'Active'}
                </div>
                <div className="absolute bottom-3 left-4 text-white flex items-center gap-1.5 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-green-400" />
                  <span>{item.village}, {item.district}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-gray-900 mb-2">{item.cropName}</h3>
                
                <div className="space-y-2 mb-6 text-sm font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Available Quantity:</span>
                    <span className="font-bold text-gray-900">{item.quantity} bundles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Bundle:</span>
                    <span className="font-bold text-green-600">₹{item.price}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => navigate('/farmer/login')}
                    className="btn btn-green w-full justify-center flex items-center gap-2 text-sm font-black uppercase py-3 shadow-lg shadow-green-600/20"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact Seller</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    if (activeTab === 'sprayers') {
      const filtered = data.sprayers.filter(s => 
        !filterText || s.equipmentType?.toLowerCase().includes(filterText.toLowerCase())
      );

      return (
        <motion.div 
          key="sprayers"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-200">
              <Wind className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-black text-gray-800">No sprayers found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search query</p>
            </div>
          ) : filtered.map((item) => (
            <motion.div 
              key={item.id || item._id} 
              variants={itemVariants} 
              className="card card-hover bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img 
                  src="/assets/cat_sprayers.jpg" 
                  alt={item.equipmentType}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Agent
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-black text-gray-900">{item.equipmentType || 'Sprayer Specialist'}</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{item.rating || '5.0'}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-sm font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-bold text-gray-900">{item.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Capacity:</span>
                    <span className="font-bold text-gray-900">{item.dailyCapacityAcres} Acres / Day</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs text-gray-500 font-bold uppercase">Service Rate</span>
                    <span className="text-2xl font-black text-gray-900">₹{item.ratePerAcre} <span className="text-xs font-normal text-gray-500">/ acre</span></span>
                  </div>

                  <button 
                    onClick={() => navigate('/farmer/login')}
                    className="btn btn-black w-full justify-center text-sm font-black uppercase py-3"
                  >
                    <span>Sign In to Hire</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Public Catalog & Preview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Explore KisanO Services</h1>
            <p className="text-gray-500 font-medium mt-1">Browse machinery rentals, paddy seedlings, and sprayer workers</p>
          </div>

          {/* Search Input Filter */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search items, locations..." 
              className="field pl-10 w-full text-sm bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative h-28 rounded-2xl overflow-hidden p-6 text-left flex flex-col justify-between transition-all border ${
                  isActive 
                    ? 'ring-4 ring-green-500/30 border-green-600 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={tab.img} alt={tab.label} className="absolute inset-0 w-full h-full object-cover" />
                <div className={`absolute inset-0 ${isActive ? 'bg-black/75' : 'bg-black/60'} transition-all`} />
                <div className="relative z-10 flex justify-between items-center">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-green-400' : 'text-white'}`} />
                  {isActive && <span className="text-xs font-black bg-green-500 text-white px-2.5 py-0.5 rounded-full">ACTIVE</span>}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-black text-white">{tab.label}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Grid */}
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>

      </div>
    </div>
  );
}
