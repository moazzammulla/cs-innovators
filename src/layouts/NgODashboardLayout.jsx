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
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-white shadow-soft md:flex">
        <div className="px-3 py-4">
          <NgoProfile />
        </div>
        <div className="px-6 pb-2 text-xs text-gray-500">NGO Portal</div>
        <nav className="mt-2 flex-1 space-y-1 px-3 pb-4">
          {ngoNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow-soft md:hidden">
          <span className="text-base font-semibold text-secondary">NGO Dashboard</span>
          <span className="text-xs text-gray-500">AI Food Waste</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default NgODashboardLayout;
