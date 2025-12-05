import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Canteen Dashboard', to: '/canteen/dashboard' },
  { label: 'NGO Dashboard', to: '/ngo/dashboard' },
  { label: 'Add Surplus', to: '/canteen/add-surplus' },
  { label: 'Pickup Tracking', to: '/pickup-tracking' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Admin', to: '/admin' },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-white shadow-soft md:flex">
        <div className="px-6 py-5 text-lg font-semibold text-secondary">AI Food Waste</div>
        <nav className="mt-2 flex-1 space-y-1 px-3 pb-4">
          {navItems.map((item) => {
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
          <span className="text-base font-semibold text-secondary">Dashboard</span>
          <span className="text-xs text-gray-500">AI Food Waste</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
