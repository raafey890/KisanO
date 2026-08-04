import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Tractor, Wind, ShieldCheck, ArrowRight } from 'lucide-react';
import RoleCard from '../../components/auth/RoleCard';

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
    <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
      <div className="text-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 mb-3 inline-block">
          Welcome to KisanO
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Select Your Role
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-2">
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigate(activeRoleObj.loginPath)}
          className="w-full sm:w-1/2 py-4 px-6 bg-green-500 hover:bg-green-400 text-white font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          Sign In as {activeRoleObj.title} <ArrowRight className="w-4 h-4" />
        </button>

        {activeRoleObj.id !== 'ADMIN' && (
          <button
            onClick={() => navigate(activeRoleObj.registerPath)}
            className="w-full sm:w-1/2 py-4 px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all hover:scale-[1.02]"
          >
            Create New Account
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Need help deciding?{' '}
        <Link to="/" className="text-green-400 font-semibold hover:underline">
          Explore features
        </Link>
      </div>
    </div>
  );
}
