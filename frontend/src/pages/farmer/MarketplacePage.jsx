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
  ChevronDown
} from 'lucide-react';
import { TractorEquipment } from '../../assets/images'; // Fallback image
import { CATEGORIES } from '../../features/marketplace/constants/mockData';
import { useProducts } from '../../features/marketplace/hooks/useProducts';

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  
  const { data: products = [], isLoading, isError } = useProducts();

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured Products
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Marketplace</h1>
            <p className="text-sm text-gray-500 mt-1">Buy seeds, fertilizers, and farm tools directly from verified sellers.</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white rounded-full px-5 py-2 text-sm font-bold">
            <Heart size={16} /> Wishlist
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products, brands, or sellers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer h-full"
              >
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">Loading products...</div>
      ) : isError ? (
        <div className="flex flex-col items-center p-12 text-red-500">
          <p>Failed to load products.</p>
        </div>
      ) : (
        <>
          {/* Featured Deals (Only show on 'All' tab) */}
          <AnimatePresence>
            {activeCategory === 'All' && searchQuery === '' && featuredProducts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Star size={16} className="fill-current" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Featured Deals</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredProducts.map(product => (
                    <ProductCard key={`featured-${product.id}`} product={product} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* All Products Grid */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900">
              {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Products' : `${activeCategory} Products`}
              <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length})</span>
            </h2>
            
            {filteredProducts.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Package size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We couldn't find any products matching your current filters. Try adjusting your search or category.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

// Subcomponent for Product Card
function ProductCard({ product }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer flex flex-col overflow-hidden border border-gray-100 bg-white rounded-2xl hover:border-green-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img 
          src={product.image || TractorEquipment} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              {product.discount}
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors z-10">
          <Heart size={14} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-bold tracking-wider text-green-600 uppercase mb-1.5">
          {product.category}
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-3">
          <CheckCircle2 size={12} className="text-green-500" />
          <span>{product.sellerName}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-gray-900">₹{product.price}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-600">
              <Star size={10} className="fill-orange-400 text-orange-400" />
              {product.rating} ({product.reviews})
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Add Button (appears on hover) */}
      <div className="px-4 pb-4 pt-0 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
        <button className="w-full btn btn-black btn-sm">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
