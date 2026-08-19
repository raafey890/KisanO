import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import { Lock, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useResetPasswordForm } from '../../features/auth/hooks/forms/useResetPasswordForm';
import { PasswordField, SubmitButton, FormError } from '../../features/auth/components/forms';

export default function ResetPasswordPage() {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    onSubmit,
    control,
    isSubmitting,
    apiError,
    formState: { errors, isValid },
  } = useResetPasswordForm({
    onSuccess: () => {
      showSuccess('Your password has been reset successfully!');
      navigate('/auth/verify-success?mode=reset');
    },
    onError: () => {
      showError('Failed to reset password. Please try again.');
    },
  });

  const passwordVal = useWatch({ control, name: 'password', defaultValue: '' });

  const reqs = [
    { label: 'Minimum 8 characters', met: passwordVal.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(passwordVal) },
    { label: 'One lowercase letter', met: /[a-z]/.test(passwordVal) },
    { label: 'One number', met: /[0-9]/.test(passwordVal) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(passwordVal) },
  ];

  // Compute strength score (0=none, 1=weak, 2=medium, 3=strong) – UI only
  const metCount = reqs.filter((r) => r.met).length;
  const strengthScore = !passwordVal ? 0
    : metCount <= 2 ? 1
    : metCount === 3 ? 2
    : 3;
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strengthScore] || '';
  const strengthObj = passwordVal ? { score: strengthScore, label: strengthLabel } : undefined;

  return (
    <div
      className="rounded-2xl p-8 sm:p-10 w-full"
      style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', boxShadow: 'var(--auth-card-shadow)' }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <Lock className="w-6 h-6 text-green-400" />
      </div>

      <div className="mb-8">
        <h1 className="text-[36px] sm:text-[40px] font-black text-white leading-none tracking-tight mb-2">
          New Password
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--auth-text-secondary)' }}>
          Your identity has been verified. Create a strong password to secure your KisanO account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <FormError error={apiError} />

        <div className="flex flex-col">
          <PasswordField
            label="New Password"
            placeholder="Enter new password"
            error={errors.password}
            disabled={isSubmitting}
            strength={strengthObj}
            autoComplete="new-password"
            {...register('password')}
          />
        </div>

        <PasswordField
          label="Confirm Password"
          placeholder="Confirm new password"
          error={errors.confirmPassword}
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />

        <div className="my-4 p-4 rounded-2xl bg-gray-950/60 border border-white/5 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Password Requirements:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {reqs.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 transition-colors">
                {req.met ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                )}
                <span className={req.met ? 'text-gray-200 font-semibold' : 'text-gray-500'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <SubmitButton
          isLoading={isSubmitting}
          disabled={!isValid}
          variant="primary"
          className="mt-6"
        >
          <span>Reset Password</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>
      </form>
    </div>
  );
}
