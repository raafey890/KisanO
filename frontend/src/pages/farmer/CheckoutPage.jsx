import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Phone, MessageSquare, Truck, 
  Zap, CreditCard, CheckCircle2, ChevronRight 
} from 'lucide-react';

const MOCK_SUMMARY = {
  items: [
    { id: 'p1', name: 'Premium Hybrid Tomato Seeds (100g)', qty: 2, price: 450 },
    { id: 'p2', name: 'Organic NPK Fertilizer (50kg)', qty: 1, price: 1200 }
  ],
  subtotal: 2100,
  delivery: 150,
  tax: 105,
  discount: 210,
  total: 2145
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [address, setAddress] = useState('Survey No. 45, Near Hanuman Temple, Village Shirpur, District Pune, Maharashtra 411001');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [instructions, setInstructions] = useState('');

  return (
    <div className="max-w-7xl mx-auto font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/farmer/cart')}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Delivery Address */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
              </h2>
              <button className="text-sm font-bold text-green-600 hover:text-green-700 underline decoration-dotted underline-offset-4">
                Change
              </button>
            </div>
            
            <div className="relative">
              <textarea 
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium focus:outline-none focus:border-green-500 transition-colors resize-none"
                placeholder="Enter your full delivery address..."
              />
            </div>
          </motion.div>

          {/* Section 2: Contact Number */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5"
          >
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" /> Contact Number
            </h2>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-black text-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="+91"
            />
          </motion.div>

          {/* Section 3: Delivery Options */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5"
          >
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-amber-500" /> Delivery Option
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Standard */}
              <div 
                onClick={() => setDeliveryOption('standard')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryOption === 'standard' 
                    ? 'border-green-600 bg-green-50/30 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-5 h-5 ${deliveryOption === 'standard' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-black text-gray-900">Standard Delivery</span>
                  </div>
                  {deliveryOption === 'standard' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-sm font-medium text-gray-500 mb-3">Delivery in 3-5 business days</p>
                <span className="font-black text-green-600">Free</span>
              </div>

              {/* Express */}
              <div 
                onClick={() => setDeliveryOption('express')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryOption === 'express' 
                    ? 'border-green-600 bg-green-50/30 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${deliveryOption === 'express' ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span className="font-black text-gray-900">Express Delivery</span>
                  </div>
                  {deliveryOption === 'express' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-sm font-medium text-gray-500 mb-3">Delivery by tomorrow</p>
                <span className="font-black text-gray-900">+ ₹200</span>
              </div>
              
            </div>
          </motion.div>

          {/* Section 4: Delivery Instructions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5"
          >
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" /> Delivery Instructions (Optional)
            </h2>
            <textarea 
              rows="2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="E.g., Call when you arrive, leave at the gate..."
            />
          </motion.div>
          
          {/* Section 5: Payment Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-lg flex items-center justify-between mt-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</span>
                <span className="text-lg font-black text-white">Select in Next Step</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>
            
            {/* Items List */}
            <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2 hide-scrollbar">
              {MOCK_SUMMARY.items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{item.name}</span>
                    <span className="text-xs font-bold text-gray-500 mt-1">Qty: {item.qty}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 shrink-0">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-gray-100 my-2"></div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{MOCK_SUMMARY.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charges</span>
                <span className="font-bold text-gray-900">
                  {deliveryOption === 'standard' ? 'Free' : '+ ₹200'}
                </span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span>Discount Applied</span>
                <span className="font-bold">-₹{MOCK_SUMMARY.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Tax (5%)</span>
                <span className="font-bold text-gray-900">₹{MOCK_SUMMARY.tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total to pay</span>
                <span className="text-3xl font-black text-green-600">
                  ₹{(MOCK_SUMMARY.total + (deliveryOption === 'express' ? 200 : 0) - MOCK_SUMMARY.delivery).toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Proceed Button */}
          <button 
            onClick={() => navigate('/farmer/payment')}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl transition-all shadow-[0_8px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            Continue to Payment <ChevronRight className="w-6 h-6" />
          </button>

        </div>
      </div>
    </div>
  );
}
