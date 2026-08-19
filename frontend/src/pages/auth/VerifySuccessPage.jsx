import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SubmitButton } from '../../features/auth/components/forms';


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
    <div
      className="rounded-2xl p-8 sm:p-10 w-full text-center flex flex-col items-center"
      style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', boxShadow: 'var(--auth-card-shadow)' }}
    >
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
      <h1 className="text-[36px] sm:text-[40px] font-black text-white leading-none tracking-tight mb-4">
        {isReset ? 'Password Reset Successful' : 'Account Verified & Activated!'}
      </h1>

      {/* Subtitle */}
      <p className="text-[15px] max-w-sm mb-6" style={{ color: 'var(--auth-text-secondary)' }}>
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
      <div className="w-full mt-6 pt-6" style={{ borderTop: '1px solid var(--auth-card-border)' }}>
        <SubmitButton
          onClick={handleProceed}
          variant="primary"
        >
          <span>{isReset ? 'Go to Login' : 'Go to Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>
      </div>
    </div>
  );
}
