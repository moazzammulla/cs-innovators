import React from 'react';

/**
 * Risk Indicator Component
 * Shows risk level for pickup items
 */
const RiskIndicator = ({ riskLevel, size = 'sm' }) => {
  if (!riskLevel) return null;

  const riskConfig = {
    low: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: '✓',
      label: 'Low Risk',
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: '⚠',
      label: 'Medium Risk',
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: '⚠',
      label: 'High Risk',
    },
  };

  const config = riskConfig[riskLevel.toLowerCase()] || riskConfig.medium;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${config.bg} ${config.color} font-medium ${sizeClasses[size]}`}
      title={config.label}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default RiskIndicator;
