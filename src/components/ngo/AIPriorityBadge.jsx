import React from 'react';

/**
 * AI Priority Badge Component
 * Displays AI-calculated priority score for pickup items
 */
const AIPriorityBadge = ({ priority, size = 'sm' }) => {
  if (!priority || priority < 1) return null;

  // Determine color based on priority (1-10 scale)
  const getColor = (priority) => {
    if (priority >= 8) return 'bg-green-100 text-green-700 border-green-300';
    if (priority >= 5) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getLabel = (priority) => {
    if (priority >= 8) return 'High';
    if (priority >= 5) return 'Medium';
    return 'Low';
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${getColor(
        priority
      )} ${sizeClasses[size]}`}
      title={`AI Priority Score: ${priority}/10`}
    >
      <span className="mr-1">🤖</span>
      {getLabel(priority)} ({priority}/10)
    </span>
  );
};

export default AIPriorityBadge;
