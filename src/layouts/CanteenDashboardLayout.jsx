import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CanteenProfile from '../components/canteen/CanteenProfile';

const canteenNavItems = [
  { label: 'Dashboard', to: '/canteen/dashboard' },
  { label: 'Add Surplus', to: '/canteen/add-surplus' },
  { label: 'Pickup Tracking', to: '/canteen/pickup-tracking' },
  { label: 'Analytics', to: '/analytics' },
];

const CanteenDashboardLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-white/80 backdrop-blur-sm border-r border-blue-200/50 shadow-lg md:flex">
        <div className="px-3 py-4">
          <CanteenProfile />
        </div>
        <div className="px-6 pb-2 text-xs text-blue-600/70 font-medium uppercase tracking-wide">Canteen Portal</div>
        <nav className="mt-2 flex-1 space-y-1 px-3 pb-4">
          {canteenNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-200/50'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col bg-transparent">
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-blue-200/50 px-4 py-3 shadow-sm md:hidden">
          <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Canteen Dashboard</span>
          <span className="text-xs text-slate-500">AI Food Waste</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default CanteenDashboardLayout;
