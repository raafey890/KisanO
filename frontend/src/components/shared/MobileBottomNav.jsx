import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav({ navItems }) {
  // Only show max 5 items on bottom nav for clarity
  const visibleItems = navItems.slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-1 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center h-[60px]">
        {visibleItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={24} className="mb-1" strokeWidth={2.5} />
            <span className="text-[11px] whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
