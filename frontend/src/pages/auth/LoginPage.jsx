import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Phone, Lock, ArrowRight, Sprout, Tractor, Wind, ShieldCheck, Shield,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLoginForm } from '../../features/auth/hooks/forms/useLoginForm';
import { AuthInput, PasswordField, SubmitButton, FormError } from '../../features/auth/components/forms';

/* ------------------------------------------------------------------ */
/* Role configuration                                                   */
/* ------------------------------------------------------------------ */
const ROLE_MAP = {
  farmer: {
    name: 'Farmer',
    roleKey: 'FARMER',
    icon: Sprout,
    redirect: '/farmer/dashboard',
    registerLink: '/farmer/register',
    loginWithOtp: '/auth/verify-otp?mode=login&role=FARMER',
  },
  owner: {
    name: 'Equipment Owner',
    roleKey: 'EQUIPMENT_OWNER',
    icon: Tractor,
    redirect: '/owner/dashboard',
    registerLink: '/owner/register',
    loginWithOtp: '/auth/verify-otp?mode=login&role=EQUIPMENT_OWNER',
  },
  sprayer: {
    name: 'Sprayer',
    roleKey: 'SPRAYER',
    icon: Wind,
    redirect: '/operator/dashboard',
    registerLink: '/sprayer/register',
    loginWithOtp: '/auth/verify-otp?mode=login&role=SPRAYER',
  },
  admin: {
    name: 'Administrator',
    roleKey: 'ADMIN',
    icon: ShieldCheck,
    redirect: '/admin/dashboard',
    registerLink: null,
    loginWithOtp: null,
  },
};

/* ------------------------------------------------------------------ */
/* Divider component                                                    */
/* ------------------------------------------------------------------ */
function Divider() {
  return (
    <div className="flex items-center gap-3 my-1" role="separator" aria-hidden="true">
      <div className="flex-1 h-px" style={{ background: 'var(--auth-card-border)' }} />
      <span className="text-[12px] font-medium tracking-widest text-slate-500 select-none">OR</span>
      <div className="flex-1 h-px" style={{ background: 'var(--auth-card-border)' }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main LoginPage                                                        */
/* ------------------------------------------------------------------ */
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full"
    >
      {/* ── Card ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-8 sm:p-10 w-full"
        style={{
          background: 'var(--auth-card-bg)',
          border: '1px solid var(--auth-card-border)',
          boxShadow: 'var(--auth-card-shadow)',
        }}
      >
        {/* ── Card header ──────────────────────────────────────── */}
        <div className="mb-8">
          <h1
            className="text-[36px] sm:text-[40px] font-black text-white leading-tight tracking-tight"
            style={{ lineHeight: '1.1' }}
          >
            Welcome Back!
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: 'var(--auth-text-secondary)' }}>
            Sign in to continue to your account.
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────── */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <FormError error={apiError} />

          {/* Mobile Number or Email */}
          <AuthInput
            label="Mobile Number or Email"
            id="login-identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="Enter mobile number or email"
            icon={<User size={18} aria-hidden="true" />}
            error={errors.identifier}
            disabled={isSubmitting}
            {...register('identifier')}
          />

          {/* Password */}
          <PasswordField
            label="Password"
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            disabled={isSubmitting}
            {...register('password')}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between gap-4">
            <label
              className="flex items-center gap-2.5 cursor-pointer select-none min-h-[44px]"
              htmlFor="login-remember"
            >
              <input
                id="login-remember"
                type="checkbox"
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-white/20 text-green-500 bg-slate-900 focus:ring-green-500 focus:ring-offset-slate-900 shrink-0 cursor-pointer"
                {...register('rememberMe')}
              />
              <span className="text-[14px]" style={{ color: 'var(--auth-text-secondary)' }}>
                Remember me
              </span>
            </label>

            <Link
              to="/auth/forgot-password"
              className="text-[14px] font-semibold transition-colors auth-focus-ring rounded px-1 min-h-[44px] flex items-center"
              style={{ color: 'var(--auth-text-accent)' }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Primary sign-in button */}
          <SubmitButton isLoading={isSubmitting} variant="primary">
            <span>Sign In</span>
            <ArrowRight size={18} aria-hidden="true" />
          </SubmitButton>

          {/* Divider */}
          <Divider />

          {/* OTP login button */}
          {roleConfig.loginWithOtp && (
            <Link
              to={roleConfig.loginWithOtp}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--auth-radius)] text-[15px] font-semibold transition-all duration-[var(--auth-duration)] auth-focus-ring"
              style={{
                background: 'transparent',
                border: '1px solid var(--auth-primary-border)',
                color: 'var(--auth-primary)',
              }}
              aria-label="Login with OTP instead of password"
            >
              <Phone size={17} aria-hidden="true" />
              Login with OTP
            </Link>
          )}
        </form>

        {/* ── Secure footer ─────────────────────────────────────── */}
        <div
          className="mt-8 pt-5 flex items-center justify-center gap-2 text-[13px]"
          style={{ borderTop: '1px solid var(--auth-card-border)', color: 'var(--auth-text-muted)' }}
        >
          <Shield size={14} aria-hidden="true" />
          Your data is protected with enterprise-grade security.
        </div>
      </div>

      {/* ── Register link (outside card) ─────────────────────── */}
      {roleConfig.registerLink && (
        <p
          className="mt-5 text-center text-[14px]"
          style={{ color: 'var(--auth-text-muted)' }}
        >
          Don't have an account?{' '}
          <Link
            to={roleConfig.registerLink}
            className="font-bold transition-colors auth-focus-ring rounded px-0.5"
            style={{ color: 'var(--auth-text-accent)' }}
          >
            Register Here
          </Link>
        </p>
      )}
    </motion.div>
  );
}