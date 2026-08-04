import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Star, 
  MapPin, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { TractorEquipment } from '../../assets/images'; // Fallback image
import tomatoSeedsImg from '../../assets/products/tomato_seeds.jpg';
import npkFertilizerImg from '../../assets/products/npk_fertilizer.jpg';
import rotavatorBladeImg from '../../assets/products/rotavator_blade.jpg';
import dripIrrigationImg from '../../assets/products/drip_irrigation.jpg';
import neemOilImg from '../../assets/products/neem_oil.jpg';
import cattleFeedImg from '../../assets/products/cattle_feed.jpg';
import mangoSeedlingImg from '../../assets/products/mango_seedling.jpg';
import handTrowelImg from '../../assets/products/hand_trowel.jpg';

const CATEGORIES = [
  'All', 'Seeds', 'Seedlings', 'Fertilizers', 'Pesticides', 
  'Farm Tools', 'Irrigation', 'Organic Products', 'Animal Feed'
];

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Hybrid Tomato Seeds (100g)',
    category: 'Seeds',
    sellerName: 'Kisan Seeds Co.',
    price: 450,
    originalPrice: 500,
    discount: '10% OFF',
    rating: 4.8,
    reviews: 124,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: tomatoSeedsImg,
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Organic NPK Fertilizer (50kg)',
    category: 'Fertilizers',
    sellerName: 'GreenFarm Organics',
    price: 1200,
    originalPrice: 1500,
    discount: '20% OFF',
    rating: 4.6,
    reviews: 89,
    availability: 'In Stock',
    deliveryEstimate: '2 Days',
    image: npkFertilizerImg,
    isFeatured: true
  },
  {
    id: 'p3',
    name: 'Heavy Duty Steel Rotavator Blade',
    category: 'Farm Tools',
    sellerName: 'Agro Implement Tools',
    price: 850,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 210,
    availability: 'Few Left',
    deliveryEstimate: '3 Days',
    image: rotavatorBladeImg,
    isFeatured: true
  },
  {
    id: 'p4',
    name: 'Drip Irrigation Starter Kit',
    category: 'Irrigation',
    sellerName: 'AquaFlow Solutions',
    price: 3400,
    originalPrice: 4000,
    discount: '15% OFF',
    rating: 4.7,
    reviews: 56,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: dripIrrigationImg,
    isFeatured: true
  },
  {
    id: 'p5',
    name: 'Neem Oil Natural Pesticide (1L)',
    category: 'Pesticides',
    sellerName: 'BioSafe Farms',
    price: 380,
    originalPrice: 400,
    discount: '5% OFF',
    rating: 4.5,
    reviews: 34,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: neemOilImg,
    isFeatured: false
  },
  {
    id: 'p6',
    name: 'Premium Cattle Feed (25kg)',
    category: 'Animal Feed',
    sellerName: 'Nandi Feeds Ltd.',
    price: 950,
    originalPrice: null,
    discount: null,
    rating: 4.4,
    reviews: 112,
    availability: 'Out of Stock',
    deliveryEstimate: 'Unknown',
    image: cattleFeedImg,
    isFeatured: false
  },
  {
    id: 'p7',
    name: 'Mango Seedlings (Alphonso) - Pack of 5',
    category: 'Seedlings',
    sellerName: 'Ratnagiri Nursery',
    price: 600,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 45,
    availability: 'In Stock',
    deliveryEstimate: '3 Days',
    image: mangoSeedlingImg,
    isFeatured: false
  },
  {
    id: 'p8',
    name: 'Multi-purpose Hand Trowel',
    category: 'Farm Tools',
    sellerName: 'Agro Implement Tools',
    price: 250,
    originalPrice: 300,
    discount: '16% OFF',
    rating: 4.3,
    reviews: 78,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: handTrowelImg,
    isFeatured: false
  }
];

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  // Filter products based on category and search
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCat = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredProducts = MOCK_PRODUCTS.filter(p => p.isFeatured);

  const ProductCard = ({ product }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 w-full bg-gray-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = TractorEquipment }} // Fallback
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
            {product.discount}
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur hover:bg-white text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-green-600">
            {product.category}
          </span>
          <h3 className="text-base font-black text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs font-semibold text-gray-500">
            Sold by <span className="text-gray-900">{product.sellerName}</span>
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-auto">
          <div className="flex items-center text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-black">
            <Star className="w-3 h-3 fill-current mr-1" />
            {product.rating}
          </div>
          <span className="text-xs font-medium text-gray-400">({product.reviews})</span>
        </div>

        {/* Price & Delivery */}
        <div className="flex items-end justify-between border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-gray-400 font-bold line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-2xl font-black text-gray-900 leading-none">
              ₹{product.price}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            {product.availability === 'In Stock' ? (
              <span className="text-[10px] font-bold uppercase text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In Stock
              </span>
            ) : product.availability === 'Out of Stock' ? (
              <span className="text-[10px] font-bold uppercase text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Out of Stock
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Few Left
              </span>
            )}
            <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
              <Package className="w-3 h-3" /> Delivery: {product.deliveryEstimate}
            </span>
          </div>
        </div>

        {/* Action */}
        <button 
          onClick={() => navigate(`/farmer/marketplace/${product.id}`)}
          className="w-full h-10 mt-1 bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white font-black text-sm uppercase tracking-wider rounded-xl transition-colors border border-gray-200 hover:border-transparent flex items-center justify-center"
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
            Marketplace
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-500">
            Buy quality farming products from trusted sellers near you.
          </p>
        </div>

        {/* Large Search Bar */}
        <div className="w-full max-w-3xl mx-auto flex items-center bg-white border-2 border-gray-200 rounded-3xl px-6 py-4 focus-within:border-green-500 focus-within:shadow-md transition-all">
          <Search className="w-7 h-7 text-gray-400 shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg font-medium ml-4 w-full"
            placeholder="Search seeds, fertilizers, tools..."
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
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={`featured-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 4. FILTERS & ALL PRODUCTS HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Products' : activeCategory}
          <span className="text-gray-400 text-base font-bold ml-3">({filteredProducts.length})</span>
        </h2>
        
        {/* Simple Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          <button className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-gray-900 cursor-pointer"
            >
              <option>Newest</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Highest Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* 5. PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl border border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900">No products found</h3>
            <p className="text-gray-500 font-medium mt-1">Try adjusting your search or category filter.</p>
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
