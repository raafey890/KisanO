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

  const getPasswordStrength = () => {
    if (!passwordVal) return { label: '', color: 'w-0 bg-transparent' };
    const metCount = reqs.filter((r) => r.met).length;

    if (metCount <= 2) return { label: 'Weak', color: 'w-1/4 bg-red-500' };
    if (metCount === 3) return { label: 'Medium', color: 'w-2/4 bg-amber-500' };
    if (metCount === 4) return { label: 'Strong', color: 'w-3/4 bg-green-500' };
    return { label: 'Very Strong', color: 'w-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-[20px]">
        <Lock className="w-6 h-6 text-green-400" />
      </div>

      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Create New Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
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
            {...register('password')}
          />

          {passwordVal && (
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all duration-300`} />
              </div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider min-w-[70px] text-right">
                {strength.label}
              </span>
            </div>
          )}
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
          className="bg-green-500 hover:bg-green-400 shadow-[0_0_25px_rgba(34,197,94,0.3)] mt-6"
        >
          <span>Reset Password</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>
      </form>
    </div>
  );
}
