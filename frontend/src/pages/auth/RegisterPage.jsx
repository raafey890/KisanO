import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, Lock, MapPin, ArrowRight, Sprout, Tractor, Wind } from 'lucide-react';
import { FormInput } from '../../components/ui/FormInput';
import { useToast } from '../../context/ToastContext';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
    email: z.string().email('Enter a valid email address').or(z.literal('')),
    district: z.string().min(2, 'District is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

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

  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      district: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const passwordVal = watch('password', '');
  const getPasswordStrength = () => {
    if (!passwordVal) return { label: '', color: 'w-0 bg-transparent' };
    if (passwordVal.length < 6) return { label: 'Weak', color: 'w-1/3 bg-red-500' };
    if (passwordVal.length < 10) return { label: 'Medium', color: 'w-2/3 bg-amber-500' };
    return { label: 'Strong', color: 'w-full bg-green-500' };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));

      showSuccess(`OTP sent to +91 ${data.phone}. Please verify to complete registration.`);
      navigate(`/auth/verify-otp?phone=${encodeURIComponent(data.phone)}&mode=register&role=${roleConfig.roleKey}`);
    } catch (err) {
      showError('Registration failed. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const IconComp = roleConfig.icon;

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl p-8 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl">
      {/* Role Badge Row */}
      <div className="flex items-center justify-between mb-6">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${roleConfig.badgeColor}`}>
          <IconComp className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{roleConfig.name} Registration</span>
        </div>

        <Link to="/auth/select-role" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
          Switch Role
        </Link>
      </div>

      {/* Header & Subtitle */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
          Create KisanO Account
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-2 leading-relaxed">
          Join thousands of farmers & equipment providers across Maharashtra.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <FormInput
          label="Full Name"
          required
          icon={User}
          placeholder="e.g. Ramesh Patil"
          error={errors.fullName}
          disabled={isLoading}
          {...register('fullName')}
        />

        {/* Mobile & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormInput
            label="Mobile Number"
            required
            icon={Phone}
            placeholder="10-digit mobile number"
            error={errors.phone}
            disabled={isLoading}
            {...register('phone')}
          />

          <FormInput
            label="Email Address"
            icon={Mail}
            placeholder="Optional email"
            error={errors.email}
            disabled={isLoading}
            {...register('email')}
          />
        </div>

        {/* District Select */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            District <span className="text-green-400">*</span>
          </label>
          <div className="relative flex items-center w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center justify-center z-10">
              <MapPin className="w-5 h-5" />
            </div>
            <select
              disabled={isLoading}
              style={{ paddingLeft: '48px', paddingRight: '40px' }}
              className={`w-full h-[50px] bg-gray-900/90 text-white text-sm font-medium rounded-xl border appearance-none ${
                errors.district
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/10 focus:border-green-500/60'
              } outline-none transition-all`}
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
            <span className="text-xs font-medium text-red-400 mt-1.5">{errors.district.message}</span>
          )}
        </div>

        {/* Password & Confirm Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col">
            <FormInput
              label="Password"
              required
              type="password"
              icon={Lock}
              placeholder="Create password"
              error={errors.password}
              disabled={isLoading}
              {...register('password')}
            />
            {passwordVal && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{strength.label}</span>
              </div>
            )}
          </div>

          <FormInput
            label="Confirm Password"
            required
            type="password"
            icon={Lock}
            placeholder="Confirm password"
            error={errors.confirmPassword}
            disabled={isLoading}
            {...register('confirmPassword')}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="pt-3 pb-1">
          <label className="flex items-start gap-3.5 text-xs text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded bg-gray-900 border-white/20 text-green-500 focus:ring-green-500 focus:ring-offset-gray-950 shrink-0"
              {...register('agreeTerms')}
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
            <span className="text-xs font-medium text-red-400 block mt-2">{errors.agreeTerms.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full h-[52px] ${roleConfig.btnColor} ${roleConfig.shadow} text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-7 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Proceed to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
        Already have an account?{' '}
        <Link to={roleConfig.loginLink} className="text-green-400 font-bold hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}