import React from 'react';
import Button from './Button';

const GoogleAuthButton = ({ text = 'Continue with Google', ...props }) => {
  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-2 text-gray-700"
      {...props}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-500 shadow">
        G
      </span>
      <span className="text-xs font-medium">{text}</span>
    </Button>
  );
};

export default GoogleAuthButton;
