import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { FormInput } from '../../components/ui/FormInput';
import { useToast } from '../../context/ToastContext';

// Zod Schema for Forgot Password
const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Mobile number or Email is required')
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid 10-digit mobile number or email address'
    ),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate sending OTP request
      await new Promise((res) => setTimeout(res, 1200));

      showSuccess('OTP has been sent successfully.');
      navigate(`/auth/verify-otp?phone=${encodeURIComponent(data.identifier)}&mode=reset`);
    } catch (err) {
      showError('Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
      {/* Icon Badge */}
      <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-[20px]">
        <KeyRound className="w-6 h-6 text-green-400" />
      </div>

      {/* Header (Heading → Subtitle: 16px, Subtitle → First Field: 24px) */}
      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Forgot Your Password?
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Enter your registered mobile number or email address. We'll send you a One-Time Password (OTP) to securely reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Mobile Number or Email"
          required
          icon={Phone}
          placeholder="e.g. 9876543210 or user@kisano.in"
          error={errors.identifier}
          disabled={isLoading}
          {...register('identifier')}
        />

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full h-[50px] bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 mt-6 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Send OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Secondary Action Text Link (Button → Footer Link: 24px) */}
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
