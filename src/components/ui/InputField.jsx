import React from 'react';

const InputField = ({ label, name, type = 'text', error, ...props }) => {
  return (
    <div className="space-y-1 text-sm">
      {label && (
        <label htmlFor={name} className="block text-xs font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
