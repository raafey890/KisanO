import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Phone, Lock, LogIn, Sprout, Tractor, Wind, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLoginForm } from '../../features/auth/hooks/forms/useLoginForm';
import { AuthInput, PasswordField, SubmitButton, FormError } from '../../features/auth/components/forms';

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

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    onSubmit,
    isSubmitting,
    apiError,
    formState: { errors },
  } = useLoginForm({
    onSuccess: () => {
      showSuccess(`Welcome back! Logged in as ${roleConfig.name}.`);
      navigate(roleConfig.redirect);
    },
    onError: () => {
      showError('Invalid credentials. Please check your details and try again.');
    },
  });

  const IconComp = roleConfig.icon;

  return (
    <div className="bg-gray-900/90 border border-white/10 rounded-3xl pt-10 pb-10 px-8 sm:px-10 lg:px-12 backdrop-blur-xl shadow-2xl">
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

      <div className="mb-[24px]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-[16px]">
          Sign In to KisanO
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
          Enter your registered mobile number or email address below.
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

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          error={errors.password}
          disabled={isSubmitting}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-xs font-semibold pt-1 mb-[24px]">
          <label className="flex items-center gap-3 text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-gray-900 border-white/20 text-green-500 focus:ring-green-500 focus:ring-offset-gray-950 shrink-0 focus-visible:ring-2 focus-visible:ring-green-500"
              {...register('rememberMe')}
              disabled={isSubmitting}
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

        <SubmitButton
          isLoading={isSubmitting}
          className={`${roleConfig.btnColor} ${roleConfig.shadow}`}
        >
          <span>Sign In</span>
          <LogIn className="w-4 h-4" />
        </SubmitButton>
      </form>

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