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
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden w-64 flex-shrink-0 flex-col glass-card border-r border-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] md:flex">
        <div className="px-3 py-4">
          <NgoProfile />
        </div>
        <div className="px-6 pb-2 text-xs text-emerald-300/60 font-medium uppercase tracking-wide">NGO Portal</div>
        <nav className="mt-2 flex-1 space-y-1 px-3 pb-4">
          {ngoNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col bg-slate-950">
        <header className="flex items-center justify-between glass-card border-b border-emerald-400/20 px-4 py-3 md:hidden">
          <span className="text-base font-semibold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">NGO Dashboard</span>
          <span className="text-xs text-gray-400">AI Food Waste</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default NgODashboardLayout;
