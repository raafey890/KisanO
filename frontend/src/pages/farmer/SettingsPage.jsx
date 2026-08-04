import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Shield, HelpCircle, Info, ChevronRight,
  Globe, Moon, Bell, MapPin, Camera, HardDrive,
  Key, Smartphone, Trash2, Mail, MessageSquare, Phone,
  FileText, Code, AlertTriangle
} from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'about', label: 'About', icon: Info },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Toggle state mocks
  const [toggles, setToggles] = useState({
    notifications: true,
    darkMode: false,
    location: true,
    camera: true,
    storage: false,
    twoFactor: false
  });

  const handleToggle = (key) => {
    setToggles(prev => {
      const newState = !prev[key];
      
      // Actually apply dark mode to the DOM if it's the darkMode toggle
      if (key === 'darkMode') {
        if (newState) {
          document.documentElement.classList.add('dark');
          // Fallback if dark classes aren't fully implemented yet across the app
          document.body.style.backgroundColor = '#111827';
          document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        } else {
          document.documentElement.classList.remove('dark');
          document.body.style.backgroundColor = '';
          document.body.style.filter = '';
        }
      }
      
      return { ...prev, [key]: newState };
    });
  };

  // Reusable Toggle Component
  const ToggleSwitch = ({ label, description, icon: Icon, stateKey }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
          {description && <p className="text-xs font-medium text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button 
        onClick={() => handleToggle(stateKey)}
        className={`w-12 h-6 rounded-full transition-colors relative ${toggles[stateKey] ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <motion.div 
          layout
          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
          animate={{ left: toggles[stateKey] ? '1.5rem' : '0.125rem' }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );

  // Reusable Action Row Component
  const ActionRow = ({ label, description, icon: Icon, onClick, destructive }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors group ${destructive ? 'hover:border-red-200 hover:bg-red-50/50' : 'hover:border-green-200 hover:bg-white'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm ${destructive ? 'text-red-500' : 'text-gray-600 group-hover:text-green-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h4 className={`font-bold text-sm ${destructive ? 'text-red-600' : 'text-gray-900'}`}>{label}</h4>
          {description && <p className="text-xs font-medium text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 ${destructive ? 'text-red-300' : 'text-gray-300 group-hover:text-green-500'}`} />
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-32 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div className="pt-2 sm:pt-4">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Settings Hub</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">Manage your preferences, security, and account settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. SIDEBAR TABS */}
        <div className="w-full lg:w-72 shrink-0 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>

        {/* 3. CONTENT AREA */}
        <div className="flex-1 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* GENERAL SETTINGS */}
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">Preferences</h2>
                  <div className="space-y-3">
                    <ToggleSwitch label="Push Notifications" description="Receive updates about bookings and orders" icon={Bell} stateKey="notifications" />
                    <ToggleSwitch label="Dark Mode" description="Switch to a darker theme (Beta)" icon={Moon} stateKey="darkMode" />
                    
                    {/* Language Dropdown Alternative */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                           <Globe className="w-5 h-5 text-gray-600" />
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900 text-sm">App Language</h4>
                           <p className="text-xs font-medium text-gray-500 mt-0.5">Select your preferred language</p>
                         </div>
                      </div>
                      <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-700 outline-none">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">App Permissions</h2>
                  <div className="space-y-3">
                    <ToggleSwitch label="Location Access" description="Required to find nearby sprayer services" icon={MapPin} stateKey="location" />
                    <ToggleSwitch label="Camera Access" description="Required for AI Plant Doctor scans" icon={Camera} stateKey="camera" />
                    <ToggleSwitch label="Storage Access" description="Required to save PDF reports" icon={HardDrive} stateKey="storage" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECURITY SETTINGS */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">Login & Security</h2>
                  <div className="space-y-3">
                    <ActionRow label="Change Password" description="Update your account password" icon={Key} />
                    <ToggleSwitch label="Two-Factor Authentication (2FA)" description="Add an extra layer of security via SMS" icon={Shield} stateKey="twoFactor" />
                    <ActionRow label="Manage Login Devices" description="Review active sessions on other devices" icon={Smartphone} />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-xl font-black text-red-600 mb-4">Danger Zone</h2>
                  <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-red-900 text-sm">Delete Account</h4>
                      <p className="text-xs font-medium text-red-700 mt-1 max-w-sm">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shrink-0">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUPPORT SETTINGS */}
            {activeTab === 'support' && (
              <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">Contact Support</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button className="h-16 flex items-center justify-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-2xl transition-colors border border-green-200">
                      <MessageSquare className="w-5 h-5" /> Chat Support
                    </button>
                    <button className="h-16 flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl transition-colors border border-blue-200">
                      <Phone className="w-5 h-5" /> Call Expert (Toll Free)
                    </button>
                  </div>
                  <div className="space-y-3">
                    <ActionRow label="Send an Email" description="support@kisano.in" icon={Mail} />
                    <ActionRow label="Report an Issue" description="Report a bug or problem with the app" icon={AlertTriangle} />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">Help Resources</h2>
                  <div className="space-y-3">
                    <ActionRow label="Frequently Asked Questions (FAQ)" description="Find quick answers to common questions" icon={HelpCircle} />
                    <ActionRow label="Video Tutorials" description="Learn how to use AI Doctor and Marketplace" icon={Info} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ABOUT SETTINGS */}
            {activeTab === 'about' && (
              <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex flex-col items-center justify-center py-8 text-center border-b border-gray-100">
                  <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center shadow-lg mb-4">
                     <span className="text-3xl font-black text-white">K</span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">KisanO Marketplace</h2>
                  <p className="text-sm font-bold text-green-600 mt-1">Version 2.4.1 (Build 492)</p>
                  <p className="text-xs font-medium text-gray-500 mt-2 max-w-sm">Empowering farmers with modern tools, marketplace access, and AI intelligence.</p>
                </div>

                <div className="space-y-3 pt-4">
                  <ActionRow label="Terms & Conditions" icon={FileText} />
                  <ActionRow label="Privacy Policy" icon={Shield} />
                  <ActionRow label="Open Source Licenses" icon={Code} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
