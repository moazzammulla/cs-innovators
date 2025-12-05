import React from 'react';

const mapStatusToStyle = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized?.includes('pending') || normalized?.includes('posted')) {
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
  }
  if (normalized?.includes('assigned') || normalized?.includes('accepted')) {
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  }
  if (normalized?.includes('picked')) {
    return 'bg-purple-50 text-purple-700 border border-purple-200';
  }
  if (normalized?.includes('delivered') || normalized?.includes('completed')) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`badge ${mapStatusToStyle(status)}`}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export default StatusBadge;
