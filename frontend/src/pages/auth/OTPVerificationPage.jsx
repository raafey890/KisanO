import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import OTPInput from '../../components/auth/OTPInput';
import { useToast } from '../../context/ToastContext';
import { useOTPForm } from '../../features/auth/hooks/forms/useOTPForm';
import { SubmitButton } from '../../features/auth/components/forms';

export default function OTPVerificationPage() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '9876543210';
  const mode = searchParams.get('mode') || 'register'; // 'register' | 'reset'
  const role = searchParams.get('role') || 'FARMER';

  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(30);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const { isSubmitting, apiError, onSubmit, setValue } = useOTPForm({
    onSuccess: () => {
      showSuccess('OTP Verified Successfully');
      if (mode === 'reset') {
        navigate(`/auth/reset-password?phone=${encodeURIComponent(phone)}`);
      } else {
        navigate(`/auth/verify-success?role=${role}`);
      }
    },
    onError: () => {
      showError('Invalid OTP. Please try again.');
    },
  });

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

  const handleVerify = () => {
    if (otpValue.length !== 6) {
      showError('Please enter a complete 6-digit OTP code.');
      return;
    }
    setValue('otp', otpValue);
    onSubmit({ preventDefault: () => {} });
  };

  const formattedTimer = `00:${String(timer).padStart(2, '0')}`;

  return (
    <div
      className="rounded-2xl p-8 sm:p-10 w-full"
      style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', boxShadow: 'var(--auth-card-shadow)' }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <ShieldCheck className="w-6 h-6 text-green-400" />
      </div>

      <div className="mb-8">
        <h1 className="text-[36px] sm:text-[40px] font-black text-white leading-none tracking-tight mb-2">
          Verify OTP
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--auth-text-secondary)' }}>
          Enter the 6-digit One-Time Password (OTP) sent to your registered mobile number or email address.
        </p>
      </div>

      <OTPInput
        length={6}
        onChange={(code) => setOtpValue(code)}
        onComplete={(code) => setOtpValue(code)}
        disabled={isSubmitting}
      />
      {apiError && <p className="text-sm text-red-500 mt-2">{apiError.message}</p>}

      <div className="flex items-center justify-between text-xs font-semibold my-[20px] mb-[24px]">
        <span className="text-gray-400">
          {timer > 0 ? `Resend OTP in ${formattedTimer}` : "Didn't receive the code?"}
        </span>

        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || isSubmitting}
          className="text-green-400 hover:text-green-300 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-green-400 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:outline-none rounded px-1.5 py-0.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Resend OTP</span>
        </button>
      </div>

      <SubmitButton
        onClick={handleVerify}
        disabled={isSubmitting || otpValue.length !== 6}
        isLoading={isSubmitting}
        variant="primary"
        className="mt-6"
      >
        <span>Verify OTP</span>
        <ArrowRight className="w-4 h-4" />
      </SubmitButton>

      <div
        className="mt-8 pt-6 text-center text-[14px]"
        style={{ borderTop: '1px solid var(--auth-card-border)', color: 'var(--auth-text-muted)' }}
      >
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 font-bold transition-colors auth-focus-ring rounded px-2 py-1"
          style={{ color: 'var(--auth-text-accent)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
