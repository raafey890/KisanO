import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ArrowRight, ArrowLeft,
  ShoppingCart, Bookmark, Tag, CheckCircle2
} from 'lucide-react';
import { TractorEquipment } from '../../assets/images';
import tomatoSeedsImg from '../../assets/products/tomato_seeds.jpg';
import npkFertilizerImg from '../../assets/products/npk_fertilizer.jpg';

const INITIAL_CART = [
  {
    id: 'c1',
    product: {
      id: 'p1',
      name: 'Premium Hybrid Tomato Seeds (100g)',
      image: tomatoSeedsImg,
      seller: 'Kisan Seeds Co.'
    },
    price: 450,
    quantity: 2
  },
  {
    id: 'c2',
    product: {
      id: 'p2',
      name: 'Organic NPK Fertilizer (50kg)',
      image: npkFertilizerImg,
      seller: 'GreenFarm Organics'
    },
    price: 1200,
    quantity: 1
  }
];

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (coupon.trim() !== '') {
      setCouponApplied(true);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? (subtotal > 2000 ? 0 : 150) : 0;
  const tax = subtotal * 0.05; 
  const discount = couponApplied ? subtotal * 0.1 : 0; 
  const totalAmount = subtotal + delivery + tax - discount;

  return (
    <div className="max-w-7xl mx-auto font-sans pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/farmer/marketplace')}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
            {cartItems.length} Items
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* ─── EMPTY STATE ─── */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto mt-12 shadow-sm"
        >
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
            <ShoppingCart className="w-16 h-16 text-gray-300" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Your cart is empty.</h2>
            <p className="text-gray-500 font-medium">Looks like you haven't added any farming products yet.</p>
          </div>
          <button 
            onClick={() => navigate('/farmer/marketplace')}
            className="mt-4 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl transition-all shadow-lg shadow-green-600/30 flex items-center gap-2"
          >
            Browse Products <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      ) : (
        /* ─── CART CONTENT ─── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start"
                >
                  {/* Image */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 cursor-pointer" onClick={() => navigate(`/farmer/marketplace/${item.product.id}`)}>
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = TractorEquipment }} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col h-full w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug line-clamp-2 cursor-pointer hover:text-green-600" onClick={() => navigate(`/farmer/marketplace/${item.product.id}`)}>
                          {item.product.name}
                        </h3>
                        <p className="text-sm font-bold text-gray-500 mt-1">
                          Seller: {item.product.seller}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      {/* Qty */}
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-gray-600 shadow-sm">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-black text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-gray-600 shadow-sm">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none h-10 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-gray-200 flex items-center justify-center gap-2">
                          <Bookmark className="w-4 h-4" /> Save
                        </button>
                        <button onClick={() => removeItem(item.id)} className="flex-1 sm:flex-none h-10 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-red-100 flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Coupon Box */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Have a Coupon?
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                  placeholder="Enter code" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold text-gray-900 focus:outline-none focus:border-green-500 disabled:opacity-60 uppercase"
                />
                <button 
                  onClick={applyCoupon}
                  disabled={couponApplied || !coupon.trim()}
                  className="px-5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-green-600">
                  <CheckCircle2 className="w-3 h-3" /> Coupon applied successfully
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="flex flex-col gap-4 text-sm font-medium text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-gray-900">
                    {delivery === 0 ? <span className="text-green-600">FREE</span> : `₹${delivery.toLocaleString()}`}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-bold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-bold text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900">Total Amount</span>
                <span className="text-3xl font-black text-green-600">₹{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button 
                  onClick={() => navigate('/farmer/checkout')} // Dummy route for future
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] flex items-center justify-center hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => navigate('/farmer/marketplace')}
                  className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
