import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';


export default function VerifySuccessPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'register';
  const role = searchParams.get('role') || 'FARMER';
  const navigate = useNavigate();
  const isReset = mode === 'reset';
  const [countdown, setCountdown] = useState(5);

  const handleProceed = () => {
    navigate('/auth/login');
  };

  // Auto redirect logic for Password Reset mode (5 seconds countdown)
  useEffect(() => {
    if (!isReset) return;

    if (countdown <= 0) {
      navigate('/auth/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isReset, countdown, navigate]);

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl text-center flex flex-col items-center">
      {/* Animated Success Checkmark Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
      >
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </motion.div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
        {isReset ? 'Password Reset Successful' : 'Account Verified & Activated!'}
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-sm mb-5">
        {isReset
          ? 'Your password has been updated successfully. You can now sign in using your new password.'
          : 'Congratulations! Your KisanO account has been fully verified and activated.'}
      </p>

      {/* Auto Redirect Countdown Display (For Password Reset) */}
      {isReset && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10 mb-2">
          <span>Redirecting to Login in <strong className="text-green-400 font-mono">{countdown} seconds</strong>...</span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="w-full mt-6 pt-6 border-t border-white/10">
        <button
          onClick={handleProceed}
          className="w-full h-[50px] bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.35)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none"
        >
          <span>{isReset ? 'Go to Login' : 'Go to Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
