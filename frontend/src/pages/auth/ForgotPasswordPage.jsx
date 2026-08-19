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
    <div
      className="rounded-2xl p-8 sm:p-10 w-full"
      style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', boxShadow: 'var(--auth-card-shadow)' }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <KeyRound className="w-6 h-6 text-green-400" />
      </div>

      <div className="mb-8">
        <h1 className="text-[36px] sm:text-[40px] font-black text-white leading-none tracking-tight mb-2">
          Forgot Password?
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--auth-text-secondary)' }}>
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
          variant="primary"
          className="mt-2"
        >
          <span>Send OTP</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>
      </form>

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
