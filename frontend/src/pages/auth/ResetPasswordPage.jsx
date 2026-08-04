import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { FormInput } from '../../components/ui/FormInput';
import { useToast } from '../../context/ToastContext';

// Zod Schema requiring 8+ chars, upper, lower, number, special char, and matching confirm password
const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password', '');

  // Requirements breakdown
  const reqs = [
    { label: 'Minimum 8 characters', met: passwordVal.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(passwordVal) },
    { label: 'One lowercase letter', met: /[a-z]/.test(passwordVal) },
    { label: 'One number', met: /[0-9]/.test(passwordVal) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(passwordVal) },
  ];

  // Password Strength Calculation (4 Levels: Weak, Medium, Strong, Very Strong)
  const getPasswordStrength = () => {
    if (!passwordVal) return { label: '', color: 'w-0 bg-transparent' };
    const metCount = reqs.filter((r) => r.met).length;

    if (metCount <= 2) return { label: 'Weak', color: 'w-1/4 bg-red-500' };
    if (metCount === 3) return { label: 'Medium', color: 'w-2/4 bg-amber-500' };
    if (metCount === 4) return { label: 'Strong', color: 'w-3/4 bg-green-500' };
    return { label: 'Very Strong', color: 'w-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API password update delay
      await new Promise((res) => setTimeout(res, 1200));

      showSuccess('Your password has been reset successfully!');
      navigate('/auth/verify-success?mode=reset');
    } catch (err) {
      showError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
      {/* Icon Badge (Icon Badge → Heading: 20px) */}
      <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-[20px]">
        <Lock className="w-6 h-6 text-green-400" />
      </div>

      {/* Header (Heading → Subtitle: 16px, Subtitle → First Field: 24px) */}
      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Create New Password
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Your identity has been verified. Create a strong password to secure your KisanO account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password */}
        <div className="flex flex-col">
          <FormInput
            label="New Password"
            required
            type="password"
            icon={Lock}
            placeholder="Enter new password"
            error={errors.password}
            disabled={isLoading}
            {...register('password')}
          />

          {/* Real-time Strength Meter (4 levels: Weak, Medium, Strong, Very Strong) */}
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

        {/* Confirm Password */}
        <FormInput
          label="Confirm Password"
          required
          type="password"
          icon={Lock}
          placeholder="Confirm new password"
          error={errors.confirmPassword}
          disabled={isLoading}
          {...register('confirmPassword')}
        />

        {/* Live Password Requirements Checklist */}
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

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full h-[50px] bg-green-500 hover:bg-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 mt-6 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating Password...</span>
            </div>
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
