import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import { User, Phone, Mail, Lock, MapPin, ArrowRight, Sprout, Tractor, Wind } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useRegisterForm } from '../../features/auth/hooks/forms/useRegisterForm';
import { AuthInput, PasswordField, SubmitButton, FormError } from '../../features/auth/components/forms';

const DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
  'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
  'Kolhapur', 'Latur', 'Mumbai', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik',
  'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli',
  'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
];

const ROLE_MAP = {
  farmer: {
    name: 'Farmer',
    roleKey: 'FARMER',
    icon: Sprout,
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    btnColor: 'bg-green-500 hover:bg-green-400',
    shadow: 'shadow-[0_0_25px_rgba(34,197,94,0.3)]',
    loginLink: '/farmer/login',
  },
  owner: {
    name: 'Equipment Owner',
    roleKey: 'EQUIPMENT_OWNER',
    icon: Tractor,
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    btnColor: 'bg-orange-500 hover:bg-orange-400',
    shadow: 'shadow-[0_0_25px_rgba(249,115,22,0.3)]',
    loginLink: '/owner/login',
  },
  sprayer: {
    name: 'Sprayer',
    roleKey: 'SPRAYER',
    icon: Wind,
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    btnColor: 'bg-blue-500 hover:bg-blue-400',
    shadow: 'shadow-[0_0_25px_rgba(59,130,246,0.3)]',
    loginLink: '/sprayer/login',
  },
};

export default function RegisterPage({ initialRole = 'farmer' }) {
  const [searchParams] = useSearchParams();
  const roleQuery = searchParams.get('role') || initialRole;
  const roleConfig = ROLE_MAP[roleQuery] || ROLE_MAP.farmer;

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    onSubmit,
    control,
    isSubmitting,
    apiError,
    formState: { errors },
  } = useRegisterForm(roleConfig.roleKey, {
    onSuccess: (data) => {
      showSuccess(`OTP sent to +91 ${data.phone}. Please verify to complete registration.`);
      navigate(`/auth/verify-otp?phone=${encodeURIComponent(data.phone)}&mode=register&role=${roleConfig.roleKey}`);
    },
    onError: () => {
      showError('Registration failed. Please check your information and try again.');
    },
  });

  const passwordVal = useWatch({ control, name: 'password', defaultValue: '' });

  // Compute strength score (0=none, 1=weak, 2=medium, 3=strong) – UI only
  const strengthScore = !passwordVal ? 0
    : passwordVal.length < 6 ? 1
    : passwordVal.length < 10 ? 2
    : 3;
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strengthScore] || '';
  const strengthObj = passwordVal ? { score: strengthScore, label: strengthLabel } : undefined;
  const IconComp = roleConfig.icon;

  return (
    <div
      className="rounded-2xl p-8 sm:p-10 w-full"
      style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', boxShadow: 'var(--auth-card-shadow)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${roleConfig.badgeColor}`}>
          <IconComp className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{roleConfig.name} Registration</span>
        </div>

        <Link to="/auth/select-role" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
          Switch Role
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-[36px] sm:text-[40px] font-black text-white leading-none tracking-tight">
          Create Account
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: 'var(--auth-text-secondary)' }}>
          Join thousands of farmers &amp; equipment providers across Maharashtra.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <FormError error={apiError} />

        <AuthInput
          label="Full Name"
          icon={<User className="h-5 w-5" />}
          placeholder="e.g. Ramesh Patil"
          error={errors.fullName}
          disabled={isSubmitting}
          {...register('fullName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AuthInput
            label="Mobile Number"
            icon={<Phone className="h-5 w-5" />}
            placeholder="10-digit mobile number"
            error={errors.phone}
            disabled={isSubmitting}
            {...register('phone')}
          />

          <AuthInput
            label="Email Address"
            icon={<Mail className="h-5 w-5" />}
            placeholder="Optional email"
            error={errors.email}
            disabled={isSubmitting}
            {...register('email')}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            District <span className="text-green-400">*</span>
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center justify-center z-10">
              <MapPin className="w-5 h-5" />
            </div>
            <select
              disabled={isSubmitting}
              style={{ paddingLeft: '48px', paddingRight: '40px' }}
              className={`w-full h-[50px] bg-gray-900/90 text-white text-sm font-medium rounded-xl border appearance-none ${
                errors.district
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/10 focus:border-[#4ADE80]'
              } focus:outline-none focus:ring-1 focus:ring-[#4ADE80]/50 transition-colors`}
              {...register('district')}
            >
              <option value="" disabled className="bg-gray-900 text-gray-500">
                Select your district
              </option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d} className="bg-gray-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>
          {errors.district && (
            <span className="text-sm text-red-400 mt-1.5">{errors.district.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col">
            <PasswordField
              label="Password"
              placeholder="Create password"
              error={errors.password}
              disabled={isSubmitting}
              strength={strengthObj}
              autoComplete="new-password"
              {...register('password')}
            />
          </div>

          <PasswordField
            label="Confirm Password"
            placeholder="Confirm password"
            error={errors.confirmPassword}
            disabled={isSubmitting}
            {...register('confirmPassword')}
          />
        </div>

        <div className="pt-3 pb-1">
          <label className="flex items-start gap-3.5 text-xs text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded bg-gray-900 border-white/20 text-green-500 focus:ring-green-500 focus:ring-offset-gray-950 shrink-0"
              {...register('agreeTerms')}
              disabled={isSubmitting}
            />
            <span className="leading-relaxed">
              I agree to KisanO's{' '}
              <Link to="/terms" className="text-green-400 font-semibold hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-400 font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="text-sm text-red-400 block mt-2">{errors.agreeTerms.message}</span>
          )}
        </div>

        <SubmitButton
          isLoading={isSubmitting}
          className={`${roleConfig.btnColor} ${roleConfig.shadow}`}
        >
          <span>Proceed to Verification</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>
      </form>

      <div
        className="mt-8 pt-6 text-center text-[14px]"
        style={{ borderTop: '1px solid var(--auth-card-border)', color: 'var(--auth-text-muted)' }}
      >
        Already have an account?{' '}
        <Link
          to={roleConfig.loginLink}
          className="font-bold auth-focus-ring rounded px-0.5"
          style={{ color: 'var(--auth-text-accent)' }}
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}