import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Smartphone, Building, 
  Wallet, Truck, ShieldCheck, CheckCircle2, Lock
} from 'lucide-react';

const MOCK_SUMMARY = {
  subtotal: 2100,
  delivery: 150,
  tax: 105,
  discount: 210,
  total: 2145
};

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR Code', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm, etc.' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, description: 'All major Indian banks supported' },
  { id: 'wallet', label: 'Mobile Wallets', icon: Wallet, description: 'Amazon Pay, Freecharge, etc.' },
  { id: 'cod', label: 'Cash on Delivery', icon: Truck, description: 'Pay when your order arrives' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const handlePlaceOrder = () => {
    navigate('/farmer/order-success');
  };

  return (
    <div className="max-w-7xl mx-auto font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/farmer/checkout')}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Payment Options */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-black text-gray-900 mb-2">Select Payment Method</h2>
            
            <div className="flex flex-col gap-4">
              {PAYMENT_METHODS.map(method => (
                <div key={method.id} className="flex flex-col">
                  <div 
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedMethod === method.id 
                        ? 'border-green-600 bg-green-50/30 shadow-md' 
                        : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === method.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <method.icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-lg">{method.label}</span>
                        <span className="text-sm font-medium text-gray-500">{method.description}</span>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4">
                      {selectedMethod === method.id ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Content Area based on selection */}
                  <AnimatePresence>
                    {selectedMethod === method.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 mt-2 bg-gray-50 border border-gray-200 rounded-2xl">
                          {method.id === 'upi' && (
                            <div className="flex flex-col gap-3">
                              <label className="text-sm font-bold text-gray-700">Enter your UPI ID</label>
                              <div className="flex gap-2">
                                <input type="text" placeholder="example@upi" className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-green-500" />
                                <button className="px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors">Verify</button>
                              </div>
                            </div>
                          )}
                          {method.id === 'card' && (
                            <div className="flex flex-col gap-3">
                              <input type="text" placeholder="Card Number" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-green-500" />
                              <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="MM/YY" className="bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-green-500" />
                                <input type="password" placeholder="CVV" maxLength="4" className="bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-green-500" />
                              </div>
                            </div>
                          )}
                          {method.id === 'netbanking' && (
                            <p className="text-sm font-medium text-gray-600 p-2">You will be redirected to your bank's secure portal after clicking Place Order.</p>
                          )}
                          {method.id === 'wallet' && (
                            <p className="text-sm font-medium text-gray-600 p-2">Select your wallet in the next step to authenticate.</p>
                          )}
                          {method.id === 'cod' && (
                            <p className="text-sm font-bold text-green-700 bg-green-100 p-3 rounded-xl border border-green-200 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Please pay the exact amount to the delivery executive.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-3 rounded-xl border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span className="text-xs font-bold uppercase tracking-wider">100% Secure & Encrypted Payments</span>
            </div>
            
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">Payment Summary</h3>
            
            {/* Price Breakdown */}
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-600">
              <div className="flex justify-between items-center">
                <span>Product Total</span>
                <span className="font-bold text-gray-900">₹{MOCK_SUMMARY.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery</span>
                <span className="font-bold text-gray-900">₹{MOCK_SUMMARY.delivery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax</span>
                <span className="font-bold text-gray-900">₹{MOCK_SUMMARY.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span>Discount</span>
                <span className="font-bold">-₹{MOCK_SUMMARY.discount.toLocaleString()}</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Grand Total</span>
                <span className="text-3xl font-black text-green-600">
                  ₹{MOCK_SUMMARY.total.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Proceed Button */}
          <button 
            onClick={handlePlaceOrder}
            className="w-full h-16 bg-gray-900 hover:bg-gray-800 text-white font-black text-lg rounded-2xl transition-all shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            <Lock className="w-5 h-5 opacity-70" /> Place Order
          </button>
          
          <p className="text-xs font-medium text-center text-gray-400 mt-2">
            By placing this order, you agree to KisanO's Terms of Service and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
}
