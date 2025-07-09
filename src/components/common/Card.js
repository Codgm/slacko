import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 