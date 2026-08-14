import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ChevronRight, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  TractorEquipment,
  HarvesterEquipment,
  RotavatorEquipment,
  CultivatorEquipment,
  SeedDrillEquipment,
  CropSprayerService,
} from '../../assets/images';
import { useEquipment } from '../../features/farmer/hooks/useEquipment';

const MOCK_EQUIPMENT_ITEMS = [
  {
    id: 'eq-1',
    equipmentName: 'Mahindra 575 DI 45 HP Tractor',
    equipmentType: 'Tractor',
    brand: 'Mahindra',
    dailyRate: 4500,
    hourlyRate: 650,
    distanceKm: 3.2,
    location: 'Nashik West',
    availability: 'Available Today',
    ownerName: 'Anandrao Deshmukh',
    rating: 4.9,
    reviewsCount: 28,
    image: TractorEquipment,
  },
  {
    id: 'eq-2',
    equipmentName: 'John Deere 5050D Heavy Duty Harvester',
    equipmentType: 'Harvester',
    brand: 'John Deere',
    dailyRate: 9800,
    hourlyRate: 1400,
    distanceKm: 5.8,
    location: 'Nashik East',
    availability: 'Available Today',
    ownerName: 'Suresh Patil',
    rating: 4.8,
    reviewsCount: 19,
    image: HarvesterEquipment,
  },
  {
    id: 'eq-3',
    equipmentName: 'Shaktiman 7-Feet Multi-Speed Rotavator',
    equipmentType: 'Rotavator',
    brand: 'Shaktiman',
    dailyRate: 3200,
    hourlyRate: 450,
    distanceKm: 2.4,
    location: 'Sinnar',
    availability: 'Available Today',
    ownerName: 'Prakash Shinde',
    rating: 4.9,
    reviewsCount: 34,
    image: RotavatorEquipment,
  },
  {
    id: 'eq-4',
    equipmentName: 'Heavy Duty 9-Tyne Cultivator',
    equipmentType: 'Cultivator',
    brand: 'Fieldking',
    dailyRate: 2400,
    hourlyRate: 350,
    distanceKm: 4.1,
    location: 'Dindori',
    availability: 'Available Today',
    ownerName: 'Ramesh Jadhav',
    rating: 4.7,
    reviewsCount: 15,
    image: CultivatorEquipment,
  },
  {
    id: 'eq-5',
    equipmentName: 'Hydraulic Tipping Agricultural Trailer',
    equipmentType: 'Trailer',
    brand: 'National',
    dailyRate: 1800,
    hourlyRate: 250,
    distanceKm: 1.8,
    location: 'Ozar',
    availability: 'Available Today',
    ownerName: 'Vikram Gaikwad',
    rating: 4.8,
    reviewsCount: 22,
    image: SeedDrillEquipment,
  },
  {
    id: 'eq-6',
    equipmentName: 'Self-Propelled High Pressure Crop Sprayer',
    equipmentType: 'Sprayer',
    brand: 'Aspee',
    dailyRate: 2800,
    hourlyRate: 400,
    distanceKm: 3.9,
    location: 'Pimpalgaon',
    availability: 'Available Today',
    ownerName: 'Ganesh Pawar',
    rating: 4.9,
    reviewsCount: 41,
    image: CropSprayerService,
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Tractor', label: 'Tractor' },
  { id: 'Harvester', label: 'Harvester' },
  { id: 'Rotavator', label: 'Rotavator' },
  { id: 'Cultivator', label: 'Cultivator' },
  { id: 'Trailer', label: 'Trailer' },
  { id: 'Sprayer', label: 'Sprayer' },
];

export default function EquipmentSearch() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useEquipment();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Simple Filters
  const [priceSort, setPriceSort] = useState('default');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Map API data or fallback to mock data
  const processedList = React.useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item, idx) => ({
        ...item,
        id: item._id || item.id,
        equipmentName: item.name || item.equipmentName,
        equipmentType: item.category || item.equipmentType,
        image: item.image || MOCK_EQUIPMENT_ITEMS[idx % MOCK_EQUIPMENT_ITEMS.length].image,
        dailyRate: item.rate || item.dailyRate || 4500,
        distanceKm: item.distanceKm || (idx + 1) * 1.5,
        ownerName: item.ownerId?.name || item.owner?.fullName || MOCK_EQUIPMENT_ITEMS[idx % MOCK_EQUIPMENT_ITEMS.length].ownerName,
        availability: item.status || 'Available Today',
        rating: item.rating || 4.9,
        reviewsCount: item.reviews || 24,
      }));
    }
    return MOCK_EQUIPMENT_ITEMS;
  }, [data]);

  // Filter Logic
  const filteredList = processedList
    .filter((item) => {
      if (selectedCategory !== 'All' && item.equipmentType.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.equipmentName.toLowerCase().includes(q);
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }
      if (distanceFilter === '5km' && item.distanceKm > 5) return false;
      if (distanceFilter === '10km' && item.distanceKm > 10) return false;
      if (availabilityFilter === 'today' && item.availability !== 'Available Today') return false;

      return true;
    })
    .sort((a, b) => {
      if (priceSort === 'low_to_high') return a.dailyRate - b.dailyRate;
      if (priceSort === 'high_to_low') return b.dailyRate - a.dailyRate;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 font-sans pb-20 pt-2 px-2 sm:px-4">
      {/* 1. HEADER SECTION (Generous 24px bottom margin) */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
          Rent Equipment
        </h1>
        <p className="text-sm sm:text-base font-medium text-gray-500 leading-relaxed pt-1">
          Find tractors, harvesters, rotavators, sprayers and other machinery available near you.
        </p>
      </div>

      {/* 2. SEARCH BAR (Explicit Inline Padding to prevent icon overlap + generous 32px spacing below) */}
      <div className="relative max-w-3xl mb-8">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center justify-center">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tractors, harvesters..."
          style={{ paddingLeft: '56px' }}
          className="w-full h-14 bg-white border-2 border-gray-200 focus:border-gray-900 text-gray-900 placeholder-gray-400 font-semibold text-base rounded-2xl pr-6 shadow-sm outline-none transition-all"
        />
      </div>

      {/* 3. CATEGORY CHIPS (Generous 32px bottom margin & label spacing) */}
      <div className="space-y-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block pl-1">
          Category
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-2xl text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SIMPLE FILTERS BAR (Generous 36px bottom margin) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm mb-10">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-green-600" />
          <span>Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-bold">
          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Price:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 font-bold text-gray-800 outline-none cursor-pointer hover:bg-gray-100"
            >
              <option value="default">Default</option>
              <option value="low_to_high">Low to High</option>
              <option value="high_to_low">High to Low</option>
            </select>
          </div>

          {/* Distance Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Distance:</span>
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 font-bold text-gray-800 outline-none cursor-pointer hover:bg-gray-100"
            >
              <option value="all">All Distances</option>
              <option value="5km">Under 5 km</option>
              <option value="10km">Under 10 km</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Availability:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 font-bold text-gray-800 outline-none cursor-pointer hover:bg-gray-100"
            >
              <option value="all">All Equipment</option>
              <option value="today">Available Today</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. EQUIPMENT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4">
            <div className="text-4xl">🚜</div>
            <h3 className="text-lg font-bold text-gray-900">No machinery found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your category or filter selections to view available equipment.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setPriceSort('default');
                setDistanceFilter('all');
                setAvailabilityFilter('all');
              }}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredList.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => navigate(`/farmer/equipment/${item.id}`)}
            >
              {/* Large Image Container */}
              <div className="h-56 relative overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.equipmentName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Availability Badge */}
                <div className="absolute top-3 left-3 bg-green-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.availability || 'Available Today'}</span>
                </div>

                {/* Star Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 shadow-md">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{item.rating || 4.9}</span>
                  <span className="text-gray-400 font-normal">({item.reviewsCount || 24})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug group-hover:text-green-600 transition-colors">
                    {item.equipmentName}
                  </h3>

                  {/* Owner & Distance Row */}
                  <div className="flex items-center justify-between mt-2 text-xs font-medium text-gray-500">
                    <span className="font-semibold text-gray-700">Owner: {item.ownerName}</span>
                    <span className="flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 text-green-600" />
                      {item.distanceKm} km away
                    </span>
                  </div>
                </div>

                {/* Price & Primary Action Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Daily Rental
                    </span>
                    <div className="text-2xl font-black text-gray-900">
                      ₹{item.dailyRate?.toLocaleString()}
                      <span className="text-xs font-bold text-gray-500"> / day</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/farmer/equipment/${item.id}`);
                    }}
                    className="h-12 px-6 bg-gray-900 hover:bg-green-600 text-white font-black text-xs rounded-2xl transition-all shadow-md flex items-center gap-1.5 group-hover:scale-105 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
