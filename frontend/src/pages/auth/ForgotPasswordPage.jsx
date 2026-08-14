import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useForgotPasswordForm } from '../../features/auth/hooks/forms/useForgotPasswordForm';
import { AuthInput, SubmitButton, FormError } from '../../features/auth/components/forms';

export default function ForgotPasswordPage() {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    onSubmit,
    isSubmitting,
    apiError,
    formState: { errors, isValid },
  } = useForgotPasswordForm({
    onSuccess: (data) => {
      showSuccess('OTP has been sent successfully.');
      navigate(`/auth/verify-otp?phone=${encodeURIComponent(data.identifier)}&mode=reset`);
    },
    onError: () => {
      showError('Unable to send OTP. Please try again.');
    },
  });

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-[20px]">
        <KeyRound className="w-6 h-6 text-green-400" />
      </div>

      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Forgot Your Password?
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Enter your registered mobile number or email address. We'll send you a One-Time Password (OTP) to securely reset your password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <FormError error={apiError} />

        <AuthInput
          label="Mobile Number or Email"
          icon={<Phone className="h-5 w-5" />}
          placeholder="e.g. 9876543210 or user@kisano.in"
          error={errors.identifier}
          disabled={isSubmitting}
          {...register('identifier')}
        />

        <SubmitButton
          isLoading={isSubmitting}
          disabled={!isValid}
          className="bg-green-500 hover:bg-green-400 shadow-[0_0_25px_rgba(34,197,94,0.3)] mt-6"
        >
          <span>Send OTP</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>
      </form>

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
