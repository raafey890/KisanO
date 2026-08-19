import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Tractor, Wind, ShieldCheck, ArrowRight } from 'lucide-react';
import RoleCard from '../../components/auth/RoleCard';
import { SubmitButton } from '../../features/auth/components/forms';

const ROLES = [
  {
    id: 'FARMER',
    title: 'Farmer',
    desc: 'Book equipment rentals, buy seeds & fertilizers, hire sprayers, and access AI plant doctor.',
    icon: Sprout,
    badge: 'Popular',
    color: 'bg-green-500/20 text-green-400',
    border: 'border-green-500/40',
    shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
    loginPath: '/farmer/login',
    registerPath: '/farmer/register',
  },
  {
    id: 'EQUIPMENT_OWNER',
    title: 'Equipment Owner',
    desc: 'List your tractors, harvesters & tools, manage rental bookings, and earn extra income.',
    icon: Tractor,
    badge: 'High Demand',
    color: 'bg-orange-500/20 text-orange-400',
    border: 'border-orange-500/40',
    shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
    loginPath: '/owner/login',
    registerPath: '/owner/register',
  },
  {
    id: 'SPRAYER',
    title: 'Crop Sprayer',
    desc: 'Offer professional spraying services to nearby farmers and manage your work schedule.',
    icon: Wind,
    badge: 'Verified',
    color: 'bg-blue-500/20 text-blue-400',
    border: 'border-blue-500/40',
    shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    loginPath: '/sprayer/login',
    registerPath: '/sprayer/register',
  },
  {
    id: 'ADMIN',
    title: 'Administrator',
    desc: 'Manage district operations, verify users, inspect bookings, and monitor platform analytics.',
    icon: ShieldCheck,
    badge: 'Management',
    color: 'bg-purple-500/20 text-purple-400',
    border: 'border-purple-500/40',
    shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    loginPath: '/admin/login',
    registerPath: '/admin/login',
  },
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState('FARMER');
  const navigate = useNavigate();

  const activeRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  return (
    <div
      className="rounded-2xl p-8 sm:p-10 w-full"
      style={{ background: 'var(--auth-card-bg)', border: '1px solid var(--auth-card-border)', boxShadow: 'var(--auth-card-shadow)' }}
    >
      <div className="text-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-3 inline-block">
          Welcome to KisanO
        </span>
        <h1 className="text-[36px] sm:text-[40px] font-black text-white leading-none tracking-tight mb-2">
          Select Your Role
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--auth-text-secondary)' }}>
          Choose how you would like to use KisanO to customize your experience.
        </p>
      </div>

      {/* Role Cards List */}
      <div className="space-y-4 mb-8">
        {ROLES.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            selected={selectedRole === role.id}
            onSelect={setSelectedRole}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
        <SubmitButton
          onClick={() => navigate(activeRoleObj.loginPath)}
          type="button"
          variant="primary"
          className="w-full sm:w-1/2"
        >
          <span>Sign In as {activeRoleObj.title}</span>
          <ArrowRight className="w-4 h-4" />
        </SubmitButton>

        {activeRoleObj.id !== 'ADMIN' && (
          <SubmitButton
            onClick={() => navigate(activeRoleObj.registerPath)}
            type="button"
            variant="outlined"
            className="w-full sm:w-1/2"
          >
            Create New Account
          </SubmitButton>
        )}
      </div>

      <div
        className="mt-8 pt-6 text-center text-[14px]"
        style={{ borderTop: '1px solid var(--auth-card-border)', color: 'var(--auth-text-muted)' }}
      >
        Need help deciding?{' '}
        <Link
          to="/"
          className="font-bold transition-colors auth-focus-ring rounded px-0.5"
          style={{ color: 'var(--auth-text-accent)' }}
        >
          Explore features
        </Link>
      </div>
    </div>
  );
}
