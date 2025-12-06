import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NgoProfile from '../components/ngo/NgoProfile';

const ngoNavItems = [
  { label: 'Dashboard', to: '/ngo/dashboard' },
  { label: 'Pickup Tracking', to: '/ngo/pickup-tracking' },
  { label: 'Analytics', to: '/analytics' },
];

const NgODashboardLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-teal-50/20">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-white/80 backdrop-blur-sm border-r border-green-200/50 shadow-lg md:flex">
        <div className="px-3 py-4">
          <NgoProfile />
        </div>
        <div className="px-6 pb-2 text-xs text-green-600/70 font-medium uppercase tracking-wide">NGO Portal</div>
        <nav className="mt-2 flex-1 space-y-1 px-3 pb-4">
          {ngoNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md shadow-green-200/50'
                    : 'text-slate-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col bg-transparent">
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-green-200/50 px-4 py-3 shadow-sm md:hidden">
          <span className="text-base font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">NGO Dashboard</span>
          <span className="text-xs text-slate-500">AI Food Waste</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default NgODashboardLayout;
