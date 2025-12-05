import React from 'react';

const DashboardCard = ({ title, value, subtitle, children }) => {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {title}
        </p>
      </div>
      <p className="text-2xl font-semibold text-secondary">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      {children}
    </div>
  );
};

export default DashboardCard;
