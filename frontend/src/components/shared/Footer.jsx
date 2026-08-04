import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#18181b', color: '#a1a1aa' }}>
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-black" style={{ color: '#fff' }}>
                Kisan<span style={{ color: '#16a34a' }}>O</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>
              India's premium digital agriculture ecosystem. Connecting farmers, equipment owners, and service providers.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#fff' }}>Platform</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { to: '/explore', label: 'Browse Equipment' },
                { to: '/explore', label: 'Marketplace' },
                { to: '/explore', label: 'Sprayer Services' },
                { to: '/farmer/login', label: 'Farmer Portal' },
              ].map(l => (
                <Link key={l.label} to={l.to} className="text-xs font-medium no-underline hover:text-white transition-colors" style={{ color: '#71717a' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#fff' }}>Portals</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { to: '/farmer/login', label: '🌾 Farmer Login' },
                { to: '/owner/login', label: '🚜 Equipment Owner Login' },
                { to: '/admin/login', label: '👑 Admin Login' },
              ].map(l => (
                <Link key={l.label} to={l.to} className="text-xs font-medium no-underline hover:text-white transition-colors" style={{ color: '#71717a' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#fff' }}>Support</h4>
            <div className="flex flex-col gap-2.5 text-xs font-medium" style={{ color: '#71717a' }}>
              <span>📧 support@kisano.in</span>
              <span>📞 +91 98765 43210</span>
              <span>📍 Hyderabad, Telangana, India</span>
            </div>
          </div>
        </div>

        <div className="pt-6" style={{ borderTop: '1px solid #27272a' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#52525b' }}>
              © 2025 KisanO. All rights reserved. Empowering Indian Agriculture.
            </p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service', 'About Us'].map(t => (
                <span key={t} className="text-xs font-medium cursor-pointer hover:text-white transition-colors" style={{ color: '#52525b' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
