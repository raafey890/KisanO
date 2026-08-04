import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Lock, LogIn, Sprout, Tractor, Wind, ShieldCheck } from 'lucide-react';
import { FormInput } from '../../components/ui/FormInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Zod Schema
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Phone number or Email is required')
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid 10-digit mobile number or email address'
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const ROLE_MAP = {
  farmer: {
    name: 'Farmer',
    roleKey: 'FARMER',
    icon: Sprout,
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    btnColor: 'bg-green-500 hover:bg-green-400',
    shadow: 'shadow-[0_0_25px_rgba(34,197,94,0.3)]',
    redirect: '/farmer/dashboard',
    registerLink: '/farmer/register',
  },
  owner: {
    name: 'Equipment Owner',
    roleKey: 'EQUIPMENT_OWNER',
    icon: Tractor,
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    btnColor: 'bg-orange-500 hover:bg-orange-400',
    shadow: 'shadow-[0_0_25px_rgba(249,115,22,0.3)]',
    redirect: '/owner/dashboard',
    registerLink: '/owner/register',
  },
  sprayer: {
    name: 'Sprayer',
    roleKey: 'SPRAYER',
    icon: Wind,
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    btnColor: 'bg-blue-500 hover:bg-blue-400',
    shadow: 'shadow-[0_0_25px_rgba(59,130,246,0.3)]',
    redirect: '/operator/dashboard',
    registerLink: '/sprayer/register',
  },
  admin: {
    name: 'Administrator',
    roleKey: 'ADMIN',
    icon: ShieldCheck,
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    btnColor: 'bg-purple-500 hover:bg-purple-400',
    shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    redirect: '/admin/dashboard',
    registerLink: null,
  },
};

export default function LoginPage({ initialRole = 'farmer' }) {
  const [searchParams] = useSearchParams();
  const roleQuery = searchParams.get('role') || initialRole;
  const roleConfig = ROLE_MAP[roleQuery] || ROLE_MAP.farmer;

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));

      const mockUser = {
        id: 'usr_' + Math.floor(Math.random() * 10000),
        name: `${roleConfig.name} User`,
        identifier: data.identifier,
        role: roleConfig.roleKey,
      };
      const mockJwtToken = 'jwt_mock_token_' + Date.now();

      login(mockUser, mockJwtToken);
      showSuccess(`Welcome back! Logged in as ${roleConfig.name}.`);
      navigate(roleConfig.redirect);
    } catch (err) {
      showError('Invalid credentials. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const IconComp = roleConfig.icon;

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
      {/* Role Badge Row (Badge → Heading: 20px) */}
      <div className="flex items-center justify-between mb-[20px]">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${roleConfig.badgeColor}`}>
          <IconComp className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{roleConfig.name} Portal</span>
        </div>

        <Link
          to="/auth/select-role"
          className="text-xs font-semibold text-gray-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:outline-none rounded-lg px-2 py-1"
        >
          Switch Role
        </Link>
      </div>

      {/* Header (Heading → Subtitle: 16px, Subtitle → First Field: 24px) */}
      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Sign In to KisanO
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Enter your registered mobile number or email address below.
        </p>
      </div>

      {/* Form (Input → Next Label: 20px) */}
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

        <FormInput
          label="Password"
          required
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          error={errors.password}
          disabled={isLoading}
          {...register('password')}
        />

        {/* Remember Me Row (Remember Row → Button: 24px) */}
        <div className="flex items-center justify-between text-xs font-semibold pt-1 mb-[24px]">
          <label className="flex items-center gap-3 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-gray-900 border-white/20 text-green-500 focus:ring-green-500 focus:ring-offset-gray-950 shrink-0 focus-visible:ring-2 focus-visible:ring-green-500"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-green-400 hover:text-green-300 font-semibold transition-colors pr-1.5 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:outline-none rounded"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button (Button → Footer Link: 24px) */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full h-[50px] ${roleConfig.btnColor} ${roleConfig.shadow} text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-6 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link (Button → Footer Link: 24px) */}
      {roleConfig.registerLink && (
        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
          Don't have an account yet?{' '}
          <Link
            to={roleConfig.registerLink}
            className="text-green-400 font-bold hover:underline focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:outline-none rounded"
          >
            Register here
          </Link>
        </div>
      )}
    </div>
  );
}