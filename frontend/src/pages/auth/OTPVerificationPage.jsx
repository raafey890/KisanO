import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import OTPInput from '../../components/auth/OTPInput';
import { useToast } from '../../context/ToastContext';

export default function OTPVerificationPage() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '9876543210';
  const mode = searchParams.get('mode') || 'register'; // 'register' | 'reset'
  const role = searchParams.get('role') || 'FARMER';

  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    showSuccess(`A new 6-digit OTP has been sent.`);
  };

  const handleVerify = async (code = otpValue) => {
    if (code.length !== 6) {
      showError('Please enter a complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate verification API delay
      await new Promise((res) => setTimeout(res, 1200));

      showSuccess('OTP Verified Successfully');

      if (mode === 'reset') {
        navigate(`/auth/reset-password?phone=${encodeURIComponent(phone)}`);
      } else {
        navigate(`/auth/verify-success?role=${role}`);
      }
    } catch (err) {
      showError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown string: 00:30, 00:29 ...
  const formattedTimer = `00:${String(timer).padStart(2, '0')}`;

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
      {/* Icon Badge (Icon Badge → Heading: 20px) */}
      <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-[20px]">
        <ShieldCheck className="w-6 h-6 text-green-400" />
      </div>

      {/* Header (Heading → Subtitle: 16px, Subtitle → OTP Input: 24px) */}
      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Verify OTP
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Enter the 6-digit One-Time Password (OTP) sent to your registered mobile number or email address.
        </p>
      </div>

      {/* Segmented 6-digit OTP Input */}
      <OTPInput
        length={6}
        onChange={(code) => setOtpValue(code)}
        onComplete={(code) => setOtpValue(code)}
        disabled={isLoading}
      />

      {/* Resend Timer / Action Row (OTP Input → Timer Row: 20px, Timer Row → Primary Button: 24px) */}
      <div className="flex items-center justify-between text-xs font-semibold my-[20px] mb-[24px]">
        <span className="text-gray-400">
          {timer > 0 ? `Resend OTP in ${formattedTimer}` : "Didn't receive the code?"}
        </span>

        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || isLoading}
          className="text-green-400 hover:text-green-300 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:outline-none rounded px-1.5 py-0.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Resend OTP</span>
        </button>
      </div>

      {/* Primary Action Button (Verify Button → Footer Link: 24px) */}
      <button
        onClick={() => handleVerify()}
        disabled={isLoading || otpValue.length !== 6}
        className="w-full h-[50px] bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>Verify OTP</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Secondary Back Link */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:outline-none rounded px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
