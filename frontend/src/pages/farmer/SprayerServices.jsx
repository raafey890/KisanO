import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, MapPin, Star, ShieldCheck, 
  Zap, CheckCircle2, ChevronDown, Award
} from 'lucide-react';

import sprayerDroneImg from '../../assets/services/sprayer_drone.jpg';
import sprayerPerson1Img from '../../assets/services/sprayer_person1.jpg';
import sprayerPerson2Img from '../../assets/services/sprayer_person2.jpg';
import sprayerPerson3Img from '../../assets/services/sprayer_person3.jpg';

const CATEGORIES = [
  'All', 'Pesticide Spraying', 'Fertilizer Spraying', 
  'Herbicide Spraying', 'Drone Spraying', 'Organic Spraying'
];

const MOCK_PROVIDERS = [
  {
    id: 's1',
    name: 'Ramesh Kumar',
    serviceType: 'Pesticide Spraying',
    startingPrice: 500,
    priceUnit: 'per acre',
    experience: 8,
    rating: 4.9,
    jobsCompleted: 342,
    distance: '2.5 km',
    availableToday: true,
    image: sprayerPerson1Img,
    isFeatured: true
  },
  {
    id: 's2',
    name: 'AeroTech AgriDrones',
    serviceType: 'Drone Spraying',
    startingPrice: 1200,
    priceUnit: 'per acre',
    experience: 3,
    rating: 4.8,
    jobsCompleted: 890,
    distance: '15 km',
    availableToday: false,
    image: sprayerDroneImg,
    isFeatured: true
  },
  {
    id: 's3',
    name: 'Suresh Patil',
    serviceType: 'Fertilizer Spraying',
    startingPrice: 450,
    priceUnit: 'per acre',
    experience: 12,
    rating: 4.7,
    jobsCompleted: 1250,
    distance: '4.2 km',
    availableToday: true,
    image: sprayerPerson2Img,
    isFeatured: true
  },
  {
    id: 's4',
    name: 'GreenLife Naturals',
    serviceType: 'Organic Spraying',
    startingPrice: 600,
    priceUnit: 'per acre',
    experience: 5,
    rating: 4.6,
    jobsCompleted: 215,
    distance: '8.0 km',
    availableToday: true,
    image: sprayerPerson3Img,
    isFeatured: true
  }
];

export default function SprayerServices() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');

  const filteredProviders = MOCK_PROVIDERS.filter(provider => {
    const matchesCat = activeCategory === 'All' || provider.serviceType === activeCategory;
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          provider.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredProviders = MOCK_PROVIDERS.filter(p => p.isFeatured);

  const ProviderCard = ({ provider }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 w-full bg-gray-100 overflow-hidden">
        <img 
          src={provider.image} 
          alt={provider.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Available Today Badge */}
        {provider.availableToday && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" /> Available Today
          </div>
        )}

        {/* Verified Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-blue-100">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-green-600">
            {provider.serviceType}
          </span>
          <h3 className="text-xl font-black text-gray-900 leading-snug line-clamp-1">
            {provider.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {provider.distance} away
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between border-y border-gray-50 py-3 mt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Rating</span>
            <div className="flex items-center gap-1 font-black text-gray-900">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              {provider.rating} <span className="text-gray-400 font-medium text-xs">({provider.jobsCompleted})</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Experience</span>
            <div className="flex items-center gap-1 font-black text-gray-900">
              <Award className="w-4 h-4 text-blue-500" />
              {provider.experience} yrs
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 leading-none">
                ₹{provider.startingPrice}
              </span>
              <span className="text-xs font-bold text-gray-500">
                /{provider.priceUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate(`/farmer/sprayers/${provider.id}`)}
          className="w-full h-11 mt-2 bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white font-black text-sm rounded-xl transition-colors border border-gray-200 hover:border-transparent flex items-center justify-center gap-2"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-sans pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER & SEARCH SECTION */}
      <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto pt-4 sm:pt-8 px-2 sm:px-0">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Sprayer Services
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500">
            Book experienced spraying professionals for your crops.
          </p>
        </div>

        {/* Flexbox Search Bar */}
        <div className="w-full max-w-3xl mx-auto flex items-center bg-white border-2 border-gray-200 rounded-3xl px-6 py-4 focus-within:border-green-500 focus-within:shadow-md transition-all">
          <Search className="w-7 h-7 text-gray-400 shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg font-medium ml-4 w-full"
            placeholder="Search spraying services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2. CATEGORY CHIPS */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 pt-2 snap-x">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`snap-start px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap border-2 ${
              activeCategory === category 
                ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 3. FEATURED SECTION (Only show on 'All' category and no search) */}
      {!searchQuery && activeCategory === 'All' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Featured Providers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map(provider => (
              <ProviderCard key={`featured-${provider.id}`} provider={provider} />
            ))}
          </div>
        </div>
      )}

      {/* 4. FILTERS & ALL PROVIDERS HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Providers' : activeCategory}
          <span className="text-gray-400 text-base font-bold ml-3">({filteredProviders.length})</span>
        </h2>
        
        {/* Optional Filters Row */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          <button className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <MapPin className="w-4 h-4 text-gray-400" /> Distance
          </button>
          <button className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-gray-400" /> Availability
          </button>
          
          <button className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> More Filters
          </button>
          
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-gray-900 cursor-pointer"
            >
              <option>Recommended</option>
              <option>Nearest First</option>
              <option>Price Low to High</option>
              <option>Highest Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* 5. PROVIDER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProviders.length > 0 ? (
          filteredProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl border border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900">No providers found</h3>
            <p className="text-gray-500 font-medium mt-1">Try adjusting your filters or searching a different area.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-6 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-black rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
