import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Star, Heart, CheckCircle2, ShieldCheck, 
  MapPin, Package, Truck, Minus, Plus, ShoppingCart, 
  Store, Phone, ChevronRight, Award
} from 'lucide-react';
import { TractorEquipment } from '../../assets/images';
import tomatoSeedsImg from '../../assets/products/tomato_seeds.jpg';

// Mock Data
const PRODUCT = {
  id: 'p1',
  name: 'Premium Hybrid Tomato Seeds (100g)',
  category: 'Seeds',
  brand: 'Kisan Seeds',
  seller: {
    name: 'Kisan Seeds Co.',
    photo: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?auto=format&fit=crop&w=100&q=80',
    verified: true,
    rating: 4.8,
    sold: 1245
  },
  price: 450,
  originalPrice: 500,
  discount: '10% OFF',
  availability: 'In Stock',
  deliveryEstimate: 'Tomorrow, by 8 PM',
  rating: 4.8,
  reviews: 124,
  images: [
    tomatoSeedsImg,
    tomatoSeedsImg,
    tomatoSeedsImg
  ],
  description: 'High-yield hybrid tomato seeds perfect for Indian climatic conditions. These seeds are treated for disease resistance and guarantee a germination rate of over 95%. Expect thick-skinned, transport-friendly tomatoes with excellent shelf life.',
  specifications: {
    'Weight': '100g',
    'Pack Size': 'Single Pack',
    'Suitable Crops': 'Tomato',
    'Type': 'Hybrid / Treated',
    'Expiry Date': 'Dec 2027',
    'Germination': '95%+'
  },
  customerReviews: [
    {
      id: 1,
      name: 'Ramesh Patil',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      text: 'Excellent germination. Almost every seed sprouted. Highly recommend for commercial farming.'
    },
    {
      id: 2,
      name: 'Suresh Kumar',
      rating: 4,
      date: '1 month ago',
      verified: true,
      text: 'Good quality seeds, but delivery was a day late. Otherwise, very satisfied.'
    },
    {
      id: 3,
      name: 'Anil Deshmukh',
      rating: 5,
      date: '2 months ago',
      verified: true,
      text: 'Have been using Kisan Seeds for 3 years. The yield is consistently high.'
    }
  ]
};

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQtyChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  return (
    <div className="max-w-7xl mx-auto font-sans pb-32 pt-2 px-2 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/farmer/marketplace')}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT: Image Gallery */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={PRODUCT.images[activeImage]} 
                alt={PRODUCT.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = TractorEquipment }}
              />
            </AnimatePresence>

            {/* Wishlist Button Overlay */}
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg border border-gray-100 transition-transform hover:scale-110 z-10"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {PRODUCT.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-green-600 shadow-md opacity-100' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" onError={(e) => { e.target.src = TractorEquipment }} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Main Info Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 flex flex-col gap-5">
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  {PRODUCT.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Brand: {PRODUCT.brand}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                {PRODUCT.name}
              </h1>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-black text-amber-600">{PRODUCT.rating}</span>
              </div>
              <span className="text-sm font-bold text-gray-500 hover:text-green-600 cursor-pointer underline decoration-dotted transition-colors">
                {PRODUCT.reviews} Reviews
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-3 pt-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 leading-none">
                ₹{PRODUCT.price}
              </span>
              {PRODUCT.originalPrice && (
                <span className="text-lg sm:text-xl text-gray-400 font-bold line-through mb-1">
                  ₹{PRODUCT.originalPrice}
                </span>
              )}
              {PRODUCT.discount && (
                <span className="text-sm font-black uppercase text-red-500 bg-red-50 px-2.5 py-1 rounded-lg mb-1 ml-2">
                  {PRODUCT.discount}
                </span>
              )}
            </div>

            {/* Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</span>
                  <span className="text-sm font-black text-gray-900">{PRODUCT.availability}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Delivery</span>
                  <span className="text-sm font-black text-gray-900">{PRODUCT.deliveryEstimate}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector (Desktop/Tablet) */}
            <div className="hidden sm:flex items-center gap-6 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1">
                <button 
                  onClick={() => handleQtyChange(-1)} 
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                <button 
                  onClick={() => handleQtyChange(1)} 
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
          </div>

          {/* Product Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-black text-gray-900 mb-4">Product Description</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              {PRODUCT.description}
            </p>
          </div>

          {/* Key Specifications */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-black text-gray-900 mb-4">Key Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(PRODUCT.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-500">{key}</span>
                  <span className="text-sm font-black text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                <img src={PRODUCT.seller.photo} alt={PRODUCT.seller.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-gray-900 text-lg">{PRODUCT.seller.name}</h4>
                  {PRODUCT.seller.verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {PRODUCT.seller.rating} Rating
                  </span>
                  <span>•</span>
                  <span>{PRODUCT.seller.sold} Products Sold</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Contact
              </button>
              <button className="flex-1 sm:flex-none h-10 px-4 bg-white border border-gray-200 hover:border-gray-900 text-gray-900 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                <Store className="w-4 h-4" /> Store
              </button>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8 sm:mb-0">
            <h3 className="text-lg font-black text-gray-900 mb-6">Customer Reviews</h3>
            
            <div className="flex flex-col gap-6">
              {PRODUCT.customerReviews.map(review => (
                <div key={review.id} className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-sm">{review.name}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 h-12 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
              Read All {PRODUCT.reviews} Reviews
            </button>
          </div>

        </div>
      </div>

      {/* STICKY BOTTOM ACTIONS (Mobile & Desktop layout unified for ease of purchase) */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-64 xl:left-64 bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-6 lg:px-8">
          
          {/* Mobile Quantity (Hidden on Desktop since it's above) */}
          <div className="flex sm:hidden w-full items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Qty</span>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1">
              <button onClick={() => handleQtyChange(-1)} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
              <button onClick={() => handleQtyChange(1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Price</span>
            <span className="text-2xl font-black text-gray-900">₹{(PRODUCT.price * quantity).toLocaleString()}</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/farmer/cart')}
              className="flex-1 sm:flex-none h-14 sm:h-16 px-6 sm:px-8 bg-gray-100 hover:bg-gray-200 text-gray-900 font-black text-sm sm:text-base rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 border border-gray-200 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button 
              onClick={() => navigate('/farmer/cart')}
              className="flex-1 sm:flex-none h-14 sm:h-16 px-6 sm:px-12 bg-green-600 hover:bg-green-700 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1"
            >
              Buy Now <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
